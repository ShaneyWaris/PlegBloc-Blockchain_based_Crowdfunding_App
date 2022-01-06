import React, { useEffect, useState } from "react";
import Common from "./Common";
import { isAuthenticated, getCurrentUser } from "../auth/helper";
import Spinner from "./Spinner";

import axios from "axios";

const AllContracts = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [visib, setVisib] = useState("visible");

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
                  setVisib("hidden");
                }
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
        .finally(() => {
          console.log("Done");
        });
    }
  }, [campaigns]);

  return (
    <>
      <Common title="Active Campaigns" data={campaigns} />
      <Spinner visib={visib} />
    </>
  );
};

export default AllContracts;
