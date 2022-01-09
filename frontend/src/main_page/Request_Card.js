import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../auth/helper";
import { approveRequest, finalizeRequest } from "../eth_scripts/core";
import web from "../../src/images/img2.svg";
import axios from "axios";

function Request_Card(props) {
  const [disableFlag, setDisableFlag] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    "http://localhost:3000/vendors/" + props.request.vendorAddress
  );

  const approveVoteClick = async (e) => {
    e.preventDefault();
  };

  const finalizeClick = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        class="card ms-5 mb-5 border-primary"
        style={{ maxWidth: 540 + "px", margin: 0 + "px", padding: 0 + "px" }}
        disabled={props.request.isComplete}
      >
        {props.complete === "complete" && (
          <div className="card-header alert-danger">
            Request #{props.request.index} {" (Complete)"}
          </div>
        )}
        {!props.request.isComplete && (
          <div className="card-header alert-success">
            Request #{props.request.index}
          </div>
        )}
        <div class="row g-0">
          <div>
            <div class="card-body">
              <h5 class="card-text">
                <u>{props.request.title}</u>
              </h5>
              <p class="card-text">
                <small class="text-muted">
                  <b>Description : </b> {props.request.description}
                </small>
                <br />
                <small class="text-muted">
                  <b>Campaign Contributors : </b>
                  {props.backers}
                </small>
                <br />
                <small class="text-muted">
                  <b>No. of Votes : </b>
                  {props.request.backers.length}
                </small>
                <br />
                <small class="text-muted">
                  <b>Amount Requested : </b>
                  {props.request.amount} Eth
                </small>

                <small class="text-muted" style={{ float: "right" }}>
                  <b>
                    <a
                      href={url}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      Vendor Details &#8599;
                    </a>
                  </b>
                </small>
              </p>
              <div className="text-center">
                {props.role === "Manager" && (
                  <button
                    className="btn btn-primary text-center"
                    disabled={
                      isLoading || props.request.isComplete === "complete"
                    }
                    onClick={finalizeClick}
                  >
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      style={isLoading ? {} : { display: "none" }}
                      aria-hidden="true"
                    ></span>
                    {!props.request.isComplete &&
                      (isLoading ? (
                        <span>Finalizing Request...</span>
                      ) : (
                        <span>Finalize Request</span>
                      ))}

                    {props.request.isComplete && <span>Request Finalized</span>}
                  </button>
                )}
                {props.role === "Contributor" && (
                  <button
                    className="btn btn-primary text-center"
                    disabled={isLoading || props.request.isComplete}
                    onClick={approveVoteClick}
                  >
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      style={isLoading ? {} : { display: "none" }}
                      aria-hidden="true"
                    ></span>
                    {!props.request.isComplete &&
                      (isLoading ? (
                        <span>Approving Request...</span>
                      ) : (
                        <span>Approve Request</span>
                      ))}

                    {props.request.isComplete && <span>Request Finalized</span>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Request_Card;
