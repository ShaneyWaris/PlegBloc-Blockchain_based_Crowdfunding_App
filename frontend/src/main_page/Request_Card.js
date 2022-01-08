import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../auth/helper";
import { approveRequest } from "../eth_scripts/core";
import axios from "axios";

function Request_Card(props) {
  const [disableFlag, setDisableFlag] = useState(false);
  const [url, setUrl] = useState(
    "http://localhost:3000/vendors/" + props.request.vendorAddress
  );

  const [voteFlag, setVoteFlag] = useState(0);
  useEffect(() => {
    if (props.buttonFlag === 0) {
      const email = getCurrentUser();
      for (let i = 0; i < props.request.backers; i++) {
        if (email === props.request.backers[i]) {
          console.log(props.request.backers[i]);
          setVoteFlag(1);
        }
      }
    }
  }, []);

  const onButtonClick = async (e) => {
    e.preventDefault();
    setDisableFlag(true);
    if (props.buttonFlag === 0) {
      axios
        .post(
          "http://localhost:8000/approveRequest",
          { id: props.request._id, email: getCurrentUser() },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            approveRequest(props.request.index, props.campaignAddress).then(
              (approve_request_flag) => {
                if (approve_request_flag === 1) {
                  alert("Request Approved Successfully");
                  window.location.reload(true);
                } else {
                  alert("Some error occurred. Try again later.");
                }
              }
            );
          }
        })
        .catch((err) => {
          alert("Some error occurred. Try again later.");
        });
    } else {
      if (props.request.backers.length <= parseInt(props.backers) / 2) {
        alert("You need a majority vote to finalize the request.");
      } else {
      }
    }
    setDisableFlag(false);
  };
  return (
    <>
      <div
        className="our_solution_category"
        disabled={props.request.isComplete || disableFlag}
      >
        <div className="solution_cards_box">
          <div
            className="solution_card"
            style={
              props.request.isComplete
                ? { background: "#1A3514" }
                : { background: "#2A3544" }
            }
          >
            <div className="solu_title text-center">
              <h6 style={{ color: "whitesmoke" }}>
                Request #{props.request.index}{" "}
                {props.request.isComplete ? " (Completed)" : ""}
              </h6>
            </div>
            <div className="solu_title">
              <h5 style={{ color: "whitesmoke" }}>
                <b>
                  <u>{props.request.title}</u>
                </b>
              </h5>
            </div>
            <div
              className="solu_description"
              style={{ color: "whitesmoke", textAlign: "justify" }}
            >
              <p className="mb-2">
                <b>Description</b> : {props.request.description}
              </p>
              <p className="mb-2">
                <b>Campaign Contributors</b> : {props.backers}
              </p>
              <p className="mb-2">
                <b>Number of Votes</b> : {props.request.backers.length}
              </p>
              <p className="mb-2">
                <b>Amount Requested</b> : {props.request.amount} Eth
              </p>
              <p className="mb-3">
                <b>Vendor</b> : {props.request.vendorName} &nbsp;{" "}
                <a
                  style={{ float: "right", color: "white" }}
                  href={url}
                  target="_blank"
                >
                  <u>Vendor Details</u>&#8594;
                </a>
              </p>
              <button
                type="button"
                className="read_more_btn"
                onClick={onButtonClick}
                style={{ backgroundColor: "SlateGrey" }}
                disabled={voteFlag === 0 ? false : true}
              >
                {props.buttonFlag === 0 &&
                  !props.request.isComplete &&
                  (voteFlag === 0 ? "Approve Request" : "Approved by me")}
                {props.buttonFlag === 0 &&
                  props.request.isComplete &&
                  (voteFlag === 0 ? "You did not approve" : "Approved by me")}
                {props.buttonFlag === 1 && "Finalize Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Request_Card;
