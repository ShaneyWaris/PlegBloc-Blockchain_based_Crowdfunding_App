import React, { useEffect, useState } from "react";
import Common from "./Common";
import { injectMetaMask, createCampaignFactory } from "../eth_scripts/core";
import { isAuthenticated, getCurrentUser } from "../auth/helper";

import axios from "axios";

const AllContracts = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    injectMetaMask();
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      const user_email = getCurrentUser();
      const data = {
        email: user_email,
      };
      axios
        .post("http://localhost:8000/getUser", data, { withCredentials: true })
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            const user = response.data.user;
            console.log(user);
            if (
              user.myCampaignFactoryAddress !== null &&
              user.myCampaignFactoryAddress === ""
            ) {
              const campaignFactoryAddress = createCampaignFactory().then(
                (address) => {
                  user.myCampaignFactoryAddress = address;
                  const data = {
                    email: user_email,
                    user: user,
                  };
                  axios
                    .post("http://localhost:8000/updateUser", data, {
                      withCredentials: true,
                    })
                    .then((response) => {
                      console.log(response.data.message);
                    })
                    .catch((error) => {
                      console.error("Error fetching data: ", error);
                    })
                    .finally(() => {
                      console.log("Factory Done");
                    });
                }
              );
            } else {
              axios
                .post(
                  "http://localhost:8000/activeCampaigns",
                  {},
                  { withCredentials: true }
                )
                .then((response) => {
                  if (response.data.isError) {
                    alert(response.data.message);
                  } else {
                    setCampaigns(response.data.allActiveCampaigns);
                    console.log(campaigns);
                  }
                });
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
        .finally(() => {
          console.log("Done");
        });
    }
  }, []);

  useEffect(() => {}, []);
  return (
    <>
      <Common title="Active Campaigns" data={campaigns} />
    </>
  );
};

export default AllContracts;
