import React from "react";
import { useLocation } from "react-router-dom";

function RequestsPage() {
  const { state } = useLocation();
  const { manager, campaignAddress, campaign, role } = state;
  return (
    <div>
      <h1>{manager}</h1>
      <h1>{role}</h1>
      <h1>{campaignAddress}</h1>
    </div>
  );
}

export default RequestsPage;
