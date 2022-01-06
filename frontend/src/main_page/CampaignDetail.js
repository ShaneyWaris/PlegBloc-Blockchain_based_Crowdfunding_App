import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import CampInfoCard from "./CampInfoCard";

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { manager, campaignAddress, contractFactoryAddress, campaign } = state;
  const [isContriLoading, setContriLoading] = useState(false);
  const [data, setData] = useState({ amount: 0 });
  const [role, setRole] = useState("dummy");
  const [_campaign, setCampaign] = useState({});

  const [usd, setUSD] = useState(0.0);

  useEffect(() => {
    if (isAuthenticated()) {
      axios
        .post(
          "http://localhost:8000/getCampaign",
          { address: campaignAddress, email: manager },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            setCampaign(response.data.campaign);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      var flag = 1;
      const email = getCurrentUser();
      if (email === manager) {
        flag = 2;
        setRole("Manager");
      }

      campaign.contributedUsers.forEach((user) => {
        if (user.email === email) {
          setRole("Contributor");
          flag = 0;
        }
      });

      if (flag === 1) {
        setRole("Visitor");
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
      .then((response) => {
        setUSD(response.data.USD);
      });
  }, []);

  const InputEvent = (event) => {
    const { name, value } = event.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const onViewRequestClick = (e) => {
    e.preventDefault();
    navigate("/viewRequests", {
      state: {
        manager: manager,
        campaignAddress: campaignAddress,
        campaign: campaign,
        role: role,
      },
    });
  };

  const onCreateRequestClick = (e) => {
    e.preventDefault();
    navigate("/createRequest", {
      state: {
        manager: manager,
        campaignAddress: campaignAddress,
        campaign: campaign,
        role: role,
      },
    });
  };

  const onMakeContributionClick = async (e) => {
    e.preventDefault();
    setContriLoading(true);
  };

  return (
    <>
      <div className="container" style={{ marginTop: "3rem" }}>
        <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
          <h3 class="display-4 fw-normal">{campaign.name}</h3>
          {campaign.type !== "Others" && (
            <h4 class="display-7 fw-normal">{campaign.type}</h4>
          )}

          <p class="fs-5 text-muted mt-4" style={{ textAlign: "justify" }}>
            {campaign.description}
          </p>
        </div>
        <div className="row">
          <div className="col-md-8">
            <main>
              <div className="row row-cols-1 row-cols-md-2 mb-3 text-center">
                <CampInfoCard
                  title="Manager 🗿"
                  id="1"
                  content={campaign.manager}
                />
                <CampInfoCard title="Role 💻" id="2" content={role} />
                <CampInfoCard
                  title="Minimum Contribution 💵"
                  id="3"
                  content={
                    campaign.minAmount +
                    "Eth | $" +
                    (campaign.minAmount * usd).toFixed(4)
                  }
                />
                <CampInfoCard
                  title="Target Contribution 💰"
                  id="4"
                  content={
                    campaign.targetAmount +
                    "Eth | $" +
                    (campaign.targetAmount * usd).toFixed(4)
                  }
                />

                <CampInfoCard
                  title="Current Contribution 💸"
                  id="5"
                  content={
                    campaign.currentContribution +
                    "Eth | $" +
                    (campaign.currentContribution * usd).toFixed(4)
                  }
                />

                <CampInfoCard
                  title="Your Contribution 💳"
                  id="6"
                  content={
                    campaign.targetAmount +
                    "Eth | $" +
                    (campaign.targetAmount * usd).toFixed(4)
                  }
                />
                <CampInfoCard title="No. of Backers 👍" id="7" content={1} />

                <CampInfoCard title="No. of Requests 📝" id="8" content={0} />
              </div>
              <br></br>
              <br></br>
            </main>
          </div>
          <div className="col-md-4">
            <div class="btn-group btn-group-lg" role="group" aria-label="...">
              <button type="button" class="btn btn-outline-secondary">
                View Requests
              </button>
              <button type="button ml-3" class="btn btn-outline-secondary">
                Create Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetail;
