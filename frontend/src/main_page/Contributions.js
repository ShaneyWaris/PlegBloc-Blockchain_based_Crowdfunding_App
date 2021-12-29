import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import Common from "./Common";

const Contributions = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (isAuthenticated()) {
      const email = getCurrentUser();
      const post_data = {
        email: email,
      };

      axios
        .post("http://localhost:8000/myContributedCampaigns", post_data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.isError) {
            alert(response.data.message);
          } else {
            setCampaigns(response.data.myContributedCampaigns);
            console.log(campaigns);
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

  return (
    <div>
      <Common title="My Contributions" data={campaigns} />
    </div>
  );
};

export default Contributions;
