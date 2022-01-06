import React from "react";
import { useNavigate } from "react-router-dom";

function CampInfoCard(props) {
  const navigate = useNavigate();

  const onCardClick = (e) => {
    e.preventDefault();
    if (props.id === "1") {
      navigate("/managerInfo", {
        state: {
          email: props.content,
        },
      });
    }
  };
  return (
    <>
      <div className="col" onClick={onCardClick}>
        <div className="card mb-4 rounded-3 shadow-sm border-primary">
          <div className="card-header py-3 text-white bg-primary border-primary">
            <h4 className="my-0 fw-normal">{props.title}</h4>
          </div>
          <div className="card-body">
            <h5 style={{ textAlign: "center" }}>{props.content}</h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default CampInfoCard;
