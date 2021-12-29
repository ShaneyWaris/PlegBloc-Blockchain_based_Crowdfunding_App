import React, { useEffect, useState } from "react";
import { getUserInfo, isAuthenticated } from "../auth/helper";
import { getAllCampaigns } from "../eth_scripts/core";
import Common from "./Common";

const PersonalCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [visib, setVisib] = useState("visible");

  useEffect(() => {
    if (isAuthenticated()) {
      const curr_user = getUserInfo();
      const curr_email = curr_user.email;
      getAllCampaigns().then((inp_campaigns) => {
        setVisib("hidden");
        let final_camps = [];
        inp_campaigns.forEach((camp) => {
          if (camp.creator_email === curr_email) {
            final_camps.push(camp);
          }
        });
        console.log(final_camps);
        setCampaigns(final_camps);
      });
    }
  }, []);

  return (
    <div>
      <Common title="My Campaigns" data={campaigns} />
      <div class="text-center">
        <div
          class="spinner-border"
          role="status"
          style={{ width: 5 + "rem", height: 5 + "rem", visibility: visib }}
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalCampaigns;
