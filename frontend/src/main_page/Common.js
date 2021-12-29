import React, { useEffect } from "react";
import Card from "./Card";
import web from "../../src/images/hero-img.png";

const Common = (props) => {
  return (
    <>
      <div className="my-5">
        <h1 className="text-center">{props.title}</h1>
      </div>
      <div className="container-fluid mb-5">
        <div className="row">
          <div className="col-10 mx-auto">
            <div className="row gy-4">
              {props.data.map((val, ind) => {
                return (
                  <Card
                    imgsrc={web}
                    title={val.name}
                    des={val.c_description}
                    campaignAddress={val.address}
                    manager={val.creator_email}
                    campaign={val}
                    key={ind}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Common;
