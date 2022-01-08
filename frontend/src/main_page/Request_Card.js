import React, { useState } from "react";
import { getCurrentUser } from "../auth/helper";

function Request_Card(props) {
  const [url, setUrl] = useState(
    "http://localhost:3000/vendors/" + props.request.vendorAddress
  );

  const onButtonClick = async (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="our_solution_category">
        <div className="solution_cards_box">
          <div className="solution_card" style={{ background: "#2A3544" }}>
            <div className="solu_title text-center">
              <h6 style={{ color: "whitesmoke" }}>
                Request #{props.request.index}
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
                style={{ backgroundColor: "SlateGrey" }}
              >
                {props.buttonFlag === 0
                  ? "Approve Request"
                  : "Finalize Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Request_Card;
