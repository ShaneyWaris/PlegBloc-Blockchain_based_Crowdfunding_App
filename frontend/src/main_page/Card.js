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
      },
    });
  };

  const colorCode = (type) => {
    if (type === "Goverment Campaign") return "DodgerBlue";
    if (type === "Venture Capital Raising Campaign") return "orange";
    if (type === "Social Cause Campaign") return "SaddleBrown";
    if (type === "Medical Campaign") return "green";
    return "SlateGrey";
  };


  const complementaryButtonColors = (type) => {
    if (type === "Goverment Campaign") return "#4169E1";
    if (type === "Venture Capital Raising Campaign") return "#FF8C00";
    if (type === "Social Cause Campaign") return "#8C141E";
    if (type === "Medical Campaign") return "#20B2AA";
    return "#2F4F4F";
  }

  return (
    <>
      {/* <div className="col-md-4 col-12 mx-auto" style={{ width: 18 + "rem" }}>
        <div className="card">
          <img src={props.imgsrc} className="card-img-top" alt={props.imgsrc} />
          <div className="card-body">
            <h5 className="card-title font-weight-bold">{props.title}</h5>
            <p className="card-text" style={{ textAlign: "justify" }}>
              {props.des}
            </p>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => onDetailClick(e)}
            >
              Details
            </button>
          </div>
        </div>
      </div> */}

      {/* <div className="col-md-4 col-12 mx-auto"> */}
            <div className="our_solution_category">
                  <div className="solution_cards_box">
                      <div className="solution_card" style={{background:colorCode(props.type)}}>
                          {/* <div className="hover_color_bubble" /> */}
                          <div className="solu_title">
                            <h3 style={{color:"whitesmoke"}}><b>{props.title}</b></h3>
                          </div>
                          <div className="solu_description" style={{color:"whitesmoke"}}>
                            <p>
                            {props.des.length>60 ? props.des.substring(0, 60)+" . . . ": props.des }
                            </p>
                            <button type="button" className="read_more_btn" onClick={(e) => onDetailClick(e)}
                            style={{backgroundColor: complementaryButtonColors(props.type)}}
                            >
                              More Details
                            </button>
                          </div>
                      </div>
                  </div>
              </div>
      {/* </div> */}
  
    </>
  );
};

export default Card;
