import React, { useState, useEffect } from "react";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import { approveRequest, finalizeRequest } from "../eth_scripts/core";
import axios from "axios";

function Request_Card(props) {
  const [isLoading, setLoading] = useState(false);
  const [url, setUrl] = useState(
    "http://localhost:3000/vendors/" + props.request.vendorAddress
  );
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    console.log(getCurrentUser());
    console.log(props.request.backers);
    if (props.role === "Contributor") {
      const curr_user = getCurrentUser();
      for (let i = 0; i < props.request.backers.length; i++) {
        if (curr_user === props.request.backers[i]) {
          setHasVoted(true);
        }
      }
    }
  }, []);

  const approveVoteClick = async (e) => {
    e.preventDefault();
    if (isAuthenticated() && !hasVoted) {
      axios
        .post(
          "http://localhost:8000/approveRequest",
          { email: getCurrentUser(), id: props.request._id },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.isError) {
            alert(response.data.message);
          } else {
            setLoading(true);
            approveRequest(props.request.index, props.campaignAddress).then(
              (flag) => {
                if (flag === 1) {
                  alert("Request Approved Successfully");
                  window.location.reload(true);
                  setLoading(false);
                } else {
                  alert("Some unexpected error occurred. :/");
                  axios
                    .post(
                      "http://localhost:8000/unApproveRequest",
                      { email: getCurrentUser(), id: props.request._id },
                      {
                        withCredentials: true,
                      }
                    )
                    .then((resp) => {
                      if (resp.data.isError) {
                        console.log(resp.data.message);
                      } else {
                        console.log("consistent");
                      }
                    });
                  setLoading(false);
                }
              }
            );
          }
        })
        .catch((error) => {
          alert("Some unexpected error occured.");
          console.log(error);
        });
    }
  };

  const finalizeClick = async (e) => {
    e.preventDefault();
    if (isAuthenticated() && !props.request.isComplete) {
      if (props.request.backers.length < parseInt(props.backers) / 2) {
        alert("You need a majority vote to finalize a request.");
      } else {
        axios
          .post(
            "http://localhost:8000/finalizeRequest",
            { id: props.request._id },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.data.isError) {
              alert(response.data.message);
            } else {
              setLoading(true);
              finalizeRequest(props.request.index, props.campaignAddress).then(
                (flag) => {
                  if (flag === 1) {
                    alert("Request Approved Successfully");
                    window.location.reload(true);
                    setLoading(false);
                  } else {
                    alert("Some unexpected error occurred. :/");
                    axios
                      .post(
                        "http://localhost:8000/unFinalizeRequest",
                        { id: props.request._id },
                        {
                          withCredentials: true,
                        }
                      )
                      .then((resp) => {
                        if (resp.data.isError) {
                          console.log(resp.data.message);
                        } else {
                          console.log("consistent");
                        }
                      });
                    setLoading(false);
                  }
                }
              );
            }
          })
          .catch((error) => {
            alert("Some unexpected error occured.");
            console.log(error);
          });
      }
    }
  };

  return (
    <>
      <div
        class="card ms-5 mb-5 border-primary"
        style={{ maxWidth: 540 + "px", margin: 0 + "px", padding: 0 + "px" }}
        disabled={props.request.isComplete || isLoading}
      >
        {props.request.isComplete && (
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
              <h5 class="card-text">{props.request.title}</h5>
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
                <br />
                <small class="text-muted">
                  <b>Vendor Name : </b>
                  {props.request.vendorName}
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
                    disabled={isLoading || props.request.isComplete}
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
                    disabled={isLoading || props.request.isComplete || hasVoted}
                    onClick={approveVoteClick}
                  >
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      style={isLoading ? {} : { display: "none" }}
                      aria-hidden="true"
                    ></span>
                    {!props.request.isComplete &&
                      !hasVoted &&
                      (isLoading ? (
                        <span>Approving Request...</span>
                      ) : (
                        <span>Approve Request</span>
                      ))}

                    {!props.request.isComplete && hasVoted && (
                      <span>Voted</span>
                    )}

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
