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
      <div className="col" onClick={onCardClick} >
        <div className="card mb-4 rounded-3 shadow-md">
          <div className="card-header py-1 text-white" style={{backgroundColor:props.color, borderColor:props.color}}>
            <h5 className="my-0 fw-normal">{props.title}</h5>
          </div>
          <div className="card-body py-2">
            <b style={{ textAlign: "center" }}>{props.content}</b>
          </div>
        </div>
      </div>
    </>
  );
}

export default CampInfoCard;