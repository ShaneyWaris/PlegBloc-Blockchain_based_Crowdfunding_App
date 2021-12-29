import { Button } from "bootstrap/dist/js/bootstrap.bundle";
import React from "react";
import { useNavigate } from "react-router-dom";

const Card = (props) => {
  const navigate = useNavigate();
  const onDetailClick = (e) => {
    e.preventDefault();
    navigate("/campaignDetail", {
      state: {
        manager: props.manager,
        campaignAddress: props.campaignAddress,
        contractFactoryAddress: props.contractFactoryAddress,
        campaign: props.campaign,
      },
    });
  };

  return (
    <>
      <div className="col-md-4 col-12 mx-auto" style={{ width: 18 + "rem" }}>
        <div className="card">
          <img src={props.imgsrc} className="card-img-top" alt={props.imgsrc} />
          <div className="card-body">
            <h5 className="card-title font-weight-bold">{props.title}</h5>
            <p className="card-text">{props.des}</p>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onDetailClick(e)}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
