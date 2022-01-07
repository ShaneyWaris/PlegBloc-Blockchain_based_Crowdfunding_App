import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import CampInfoCard from "./CampInfoCard";
import { makeContribution } from "../eth_scripts/core";

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { manager, campaignAddress } = state;
  const [data, setData] = useState({ amount: 0 });
  const [isContriLoading, setContriLoading] = useState(false);
  const [role, setRole] = useState("dummy");
  const [campaign, setCampaign] = useState({});

  const [usd, setUSD] = useState(0.0);

  const role_adjustment = async (_campaign) => {
    if (isAuthenticated()) {
      var flag = 1;
      const user_email = getCurrentUser();
      if (user_email === manager) {
        flag = 2;
        setRole("Manager");
      }

      _campaign.contributedUsers.forEach(({ email, amount, Date }) => {
        if (user_email === email) {
          setRole("Contributor");
          flag = 0;
        }
      });

      if (flag === 1) {
        setRole("Visitor");
      }
    }
  };

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
            role_adjustment(response.data.campaign);
            setCampaign(response.data.campaign);
          }
        });
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
      },
    });
  };

  const onMakeContributionClick = async (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      if (parseFloat(data.amount) < parseFloat(campaign.minAmount)) {
        alert(
          "Amount Contributed should be greater than Minimum Contribution. :/"
        );
      } else {
        setContriLoading(true);
        const contribution_flag = await makeContribution(
          data.amount,
          campaignAddress
        );
        if (contribution_flag === 1) {
          const post_data = {
            email: manager,
            campaignAddress: campaignAddress,
            amount: data.amount,
          };
          axios
            .post("http://localhost:8000/contribute", post_data, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.isError) {
                console.log(response.data.message);
              } else {
                alert("Contribution Made Successfully. :)");
                window.location.reload();
              }
            });
        } else {
          alert("Could not make the contribution. Please try again.");
        }
        setContriLoading(false);
      }
    }
  };

  const colorCode = (type) => {
    if (type === "Goverment Campaign") return "DodgerBlue";
    if (type === "Venture Capital Raising Campaign") return "orange";
    if (type === "Social Cause Campaign") return "SaddleBrown";
    if (type === "Medical Campaign") return "green";
    return "SlateGrey";
  };

  return (
    <>
      <div className="container" style={{ marginTop: "1rem" }}>
        <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
          <h3 class="display-5 fw-normal mb-3">{campaign.name}</h3>
          {campaign.type !== "Others" && (
            <h5 class="display-7 fw-normal">{campaign.type}</h5>
          )}

          <p class="fs-5 text-muted mt-4" style={{ textAlign: "justify" }}>
            {campaign.description}
          </p>
        </div>
        <div className="row">
          <div className="col-md-7">
            <main>
              <div className="row row-cols-1 row-cols-md-2 mb-3 text-center">
                <CampInfoCard
                  title="Manager 🗿"
                  id="1"
                  content={campaign.manager}
                  color={colorCode(campaign.type)}
                />
                <CampInfoCard
                  title="Role 💻"
                  id="2"
                  content={role}
                  color={colorCode(campaign.type)}
                />
                <CampInfoCard
                  title="Minimum Contribution 💵"
                  id="3"
                  content={
                    campaign.minAmount +
                    "Eth | $" +
                    (campaign.minAmount * usd).toFixed(2)
                  }
                  color={colorCode(campaign.type)}
                />
                <CampInfoCard
                  title="Target Contribution 💰"
                  id="4"
                  content={
                    campaign.targetAmount +
                    "Eth | $" +
                    (campaign.targetAmount * usd).toFixed(2)
                  }
                  color={colorCode(campaign.type)}
                />

                <CampInfoCard
                  title="Current Contribution 💸"
                  id="5"
                  content={
                    campaign.currentContribution +
                    "Eth | $" +
                    (campaign.currentContribution * usd).toFixed(2)
                  }
                  color={colorCode(campaign.type)}
                />

                <CampInfoCard
                  title="Your Contribution 💳"
                  id="6"
                  content={
                    campaign.yourContribution +
                    "Eth | $" +
                    (campaign.yourContribution * usd).toFixed(2)
                  }
                  color={colorCode(campaign.type)}
                />
                <CampInfoCard
                  title="No. of Backers 👍"
                  id="7"
                  content={campaign.totalBackers}
                  color={colorCode(campaign.type)}
                />

                <CampInfoCard
                  title="No. of Requests 📝"
                  id="8"
                  content={campaign.totalRequests}
                  color={colorCode(campaign.type)}
                />
              </div>
              <br></br>
              <br></br>
            </main>
          </div>

          <div className="col-md-5">
            {role !== "Manager" && (
              <>
                <label className="form-label mt-4">
                  Contribute to this Campaign
                </label>
                <div className="input-group mb-5">
                  <input
                    className="form-control"
                    name="amount"
                    onChange={InputEvent}
                    disabled={isContriLoading}
                    placeholder="Enter amount in Ether"
                    required
                  />
                  <span
                    class="input-group-text"
                    style={{ marginRight: "10px" }}
                  >
                    ${(data.amount * usd).toFixed(2)}
                  </span>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    disabled={isContriLoading}
                    onClick={onMakeContributionClick}
                    style={{ borderRadius: "5px" }}
                  >
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      style={isContriLoading ? {} : { display: "none" }}
                      aria-hidden="true"
                    ></span>
                    {isContriLoading ? (
                      <span>Contributing...</span>
                    ) : (
                      <span>Contribute</span>
                    )}
                  </button>
                </div>
              </>
            )}

            {(role === "Manager" || role === "Contributor") && (
              <>
                <div className="input-group mb-5">
                  <label for="exampleInputPassword1" className="form-label">
                    View all the Requests made by the Manager
                  </label>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    style={{ width: "100%", borderRadius: "5px" }}
                  >
                    View All Requests
                  </button>
                </div>
              </>
            )}

            {role === "Manager" && (
              <>
                <div className="input-group mb-5">
                  <label for="exampleInputPassword1" className="form-label">
                    Create a New Request
                  </label>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={onCreateRequestClick}
                    style={{ width: "100%", borderRadius: "5px" }}
                  >
                    Create Requests
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetail;
