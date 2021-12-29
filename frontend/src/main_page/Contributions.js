import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import Common from "./Common";

const Contributions = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [visib, setVisib] = useState("visible");

  useEffect(() => {}, []);

  return (
    <div>
      <Common title="My Contributions" data={campaigns} />
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

export default Contributions;
