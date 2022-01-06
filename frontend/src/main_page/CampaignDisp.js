import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Common from "./Common";
import axios from "axios";
import Spinner from "./Spinner";

function CampaignDisp() {
  const [campaigns, setCampaigns] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [visib, setVisib] = useState("visible");

  useEffect(() => {
    if (state === undefined) {
      navigate("/allcontracts");
    } else {
      if (isAuthenticated()) {
        const { email } = state;
        const post_data = {
          email: email,
        };

        axios
          .post("http://localhost:8000/myCampaigns", post_data, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.isError) {
              alert(response.data.message);
            } else {
              setCampaigns(response.data.allMyCampaigns);
              setVisib("hidden");
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
    }
  }, [campaigns]);

  return (
    <div>
      <Common title="Campaigns" data={campaigns} />
      <Spinner visib={visib} />
    </div>
  );
}

export default CampaignDisp;
