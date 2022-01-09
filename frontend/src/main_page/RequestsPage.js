import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Request_Card from "./Request_Card";
import Spinner from "./Spinner";

function RequestsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [requests, setRequests] = useState([]);
  const [visib, setVisib] = useState("visible");
  const [_backers, setBackers] = useState(0);
  const [_role, setRole] = useState("");
  const [_campaignAddress, setCampaignAddress] = useState("");
  const [_manager, setManager] = useState("");

  useEffect(() => {
    if (state === null) {
      navigate("/allcontracts");
    } else {
      const { manager, campaignAddress, role, backers } = state;
      setCampaignAddress(campaignAddress);
      setManager(manager);
      setBackers(parseInt(backers));
      setRole(role);
      axios
        .post(
          "http://localhost:8000/getRequests",
          {
            campaignAddress: campaignAddress,
          },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            setRequests(response.data.requests);
            setVisib("hidden");
          }
        })
        .catch((err) => {
          alert("Some unexpected error occured. Try again later.");
          navigate("/allcontracts");
        });
    }
  }, []);

  return (
    <>
      <div className="my-5">
        <h1 className="text-center">All Requests</h1>
      </div>
      <Spinner visib={visib} />
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col-10 mx-auto">
            <div className="row gy-4">
              {requests.map((val, ind) => {
                return (
                  <Request_Card
                    request={val}
                    role={_role}
                    backers={_backers}
                    campaignAddress={_campaignAddress}
                    manager={_manager}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestsPage;
