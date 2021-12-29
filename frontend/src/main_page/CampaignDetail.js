import React, { useState, useEffect } from "react";
import web from "../images/hero-img.png";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../auth/helper";

const CampaignDetail = () => {
  const { state } = useLocation();
  const { manager, campaignAddress, contractFactoryAddress, campaign } = state;

  const [role, setRole] = useState("dummy");

  useEffect(() => {
    if (isAuthenticated()) {
      var flag = 1;
      const email = getCurrentUser();
      if (email === manager) {
        flag = 2;
        setRole("manager");
      }

      campaign.contributedUsers.forEach((user) => {
        if (user.email === email) {
          setRole("contributor");
          flag = 0;
        }
      });

      if (flag === 1) {
        setRole("visitor");
      }
    }
  }, []);

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
                    <td>{campaign.minAmount} Wei</td>
                  </tr>
                  <tr>
                    <th class="pl-0 w-25" scope="row">
                      <strong>Target Amount</strong>
                    </th>
                    <td>{campaign.targetAmount} Wei</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <hr />

            <div className="col-12">
              <button
                className="btn btn-outline-primary"
                type="submit"
                id="update"
              >
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Temp2
              </button>
              <button
                className="btn btn-outline-primary ms-3"
                type="submit"
                id="logout"
              >
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {role}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CampaignDetail;
