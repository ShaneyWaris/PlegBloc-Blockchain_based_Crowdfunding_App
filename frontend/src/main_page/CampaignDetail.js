import React, { useState, useEffect } from "react";
import web from "../images/hero-img.png";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isAuthenticated } from "../auth/helper";
import { contributeToCampaign, isUserContributor } from "../eth_scripts/core";

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { manager, campaignAddress, campaign } = state;
  const [isContriLoading, setContriLoading] = useState(false);
  const [data, setData] = useState({ amount: 0 });
  const [role, setRole] = useState("dummy");

  useEffect(() => {
    if (isAuthenticated()) {
      var flag = 1;
      const email = getUserInfo().email;
      if (email === manager) {
        flag = 2;
        setRole("manager");
      }

      isUserContributor(campaignAddress).then((isContributor) => {
        if (isContributor) {
          setRole("contributor");
          flag = 0;
        }

        if (flag === 1) {
          setRole("visitor");
        }
      });
    }
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

  const onMakeContributionClick = async (e) => {
    e.preventDefault();
    setContriLoading(true);
    if (isAuthenticated()) {
      if (data.amount >= campaign.minimum_contribution) {
        const msg_flag = await contributeToCampaign(
          data.amount,
          campaignAddress
        );
        if (msg_flag == 0) {
          alert("Could not make the contribution. :/");
          setData({ amount: 0 });
        } else {
          alert("You have made a succesful contribution to the campaign. :)");
          window.location.reload(true);
        }
      } else {
        alert(
          "You need contribute greater than or equal to the minimum amount. :/"
        );
      }
    }
    setContriLoading(false);
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

  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Campaign Details</h1>
      </div>
      <section class="mb-5">
        <div class="row">
          <div class="col-md-6 mb-4 mb-md-0">
            <div id="mdb-lightbox-ui"></div>

            <div class="mdb-lightbox">
              <div class="row product-gallery mx-1">
                <div class="col-12 mb-0">
                  <figure class="view overlay rounded z-depth-1">
                    <a
                      href="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Vertical/14a.jpg"
                      data-size="710x823"
                    >
                      <img
                        src={web}
                        class="img-fluid z-depth-1"
                        style={{ height: 30 + "rem" }}
                      />
                    </a>
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <h5>{campaign.name}</h5>
            <p class="mb-2 text-muted text-uppercase small">
              {campaign.manager}
            </p>
            <p class="pt-1">{campaign.description}</p>
            <div class="table-responsive">
              <table class="table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <th class="pl-0 w-25" scope="row">
                      <strong>Minimum Contribution</strong>
                    </th>
                    <td>{campaign.minimum_contribution} Wei</td>
                  </tr>
                  <tr>
                    <th class="pl-0 w-25" scope="row">
                      <strong>Target Amount</strong>
                    </th>
                    <td>{campaign.target_amount} Wei</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr />
            <div className="col-8">
              {(role === "visitor" || role === "contributor") && (
                <div className="input-group mb-3 col-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Add amount in Wei"
                    aria-label="contribution"
                    name="amount"
                    aria-describedby="button-addon2"
                    onChange={InputEvent}
                    value={data.amount}
                    disabled={isContriLoading}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    id="button-addon2"
                    disabled={isContriLoading}
                    onClick={onMakeContributionClick}
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
                      <span>Make Contribution</span>
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="col-12">
              {(role === "manager" || role === "contributor") && (
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  id="view_request"
                  onClick={onViewRequestClick}
                >
                  View Requests
                </button>
              )}

              {role === "manager" && (
                <button
                  className="btn btn-outline-primary ms-3"
                  type="submit"
                  id="active_btn"
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {campaign.isActive
                    ? "Deactivate Campaign"
                    : "Reactivate Campaign"}
                </button>
              )}
              {role === "manager" && (
                <button
                  className="btn btn-outline-primary ms-3"
                  type="submit"
                  id="create_req_btn"
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Create Request
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CampaignDetail;
