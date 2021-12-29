import React, { useEffect, useState } from "react";
import Common from "./Common";
import { getAllCampaigns } from "../eth_scripts/core";
import { isAuthenticated } from "../auth/helper";

const AllContracts = () => {
  const [visib, setVisib] = useState("visible");
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    if (isAuthenticated()) {
      getAllCampaigns().then((inp_campaigns) => {
        setVisib("hidden");
        console.log(inp_campaigns);
        setCampaigns(inp_campaigns);
      });
    }
  }, []);

  return (
    <>
      <Common title="Active Campaigns" data={campaigns} />
      <div class="text-center">
        <div
          class="spinner-border"
          role="status"
          style={{ width: 5 + "rem", height: 5 + "rem", visibility: visib }}
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default AllContracts;
