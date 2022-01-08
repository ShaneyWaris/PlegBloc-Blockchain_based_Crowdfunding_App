import React from "react";

function Request_Card() {
  return (
    <>
      <div className="our_solution_category">
                  <div className="solution_cards_box">
                      <div className="solution_card" style={{background:"#2A3544"}}>
                          <div className="solu_title text-center">
                            <h6 style={{color:"whitesmoke"}}>Request #1</h6>
                          </div>
                          <div className="solu_title">
                            <h5 style={{color:"whitesmoke"}}><b><u>Hiring Advertisers</u></b></h5>
                          </div>
                          <div className="solu_description" style={{color:"whitesmoke", textAlign: "justify"}}>
                            <p className="mb-2"><b>Description</b> : request description request description request description request description request description request description</p>
                            <p className="mb-2"><b>Number of Backers</b> : 1</p>
                            <p className="mb-2"><b>Number of Votes</b> : 0</p>
                            <p className="mb-2"><b>Amount Requested</b> : 1 Eth</p>
                            <p className="mb-3"><b>Vendor</b> : Abhinav vendor &nbsp; <a style={{float:"right"}}><u>Vendor Details</u> &nbsp; ↗</a></p>
                            <button type="button" className="read_more_btn"
                            style={{backgroundColor: "SlateGrey"}}
                            >
                              Approve Request
                            </button>
                          </div>
                      </div>
                  </div>
        </div>
    </>
  );
}

export default Request_Card;
