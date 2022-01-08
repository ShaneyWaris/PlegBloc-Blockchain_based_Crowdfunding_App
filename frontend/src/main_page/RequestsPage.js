import React from "react";
import Request_Card from "./Request_Card";

function RequestsPage() {
  return (
    <>
      <div className="my-5">
        <h1 className="text-center">All Requests</h1>
      </div>
      <div className="container-fluid mb-5">
        <div className="row">
          <div className="col-10 mx-auto">
            <div className="row gy-4">
              <Request_Card />
              <Request_Card />
              <Request_Card />
              <Request_Card />
              <Request_Card />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestsPage;
