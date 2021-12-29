import React from "react";
import Card from "./Card";
import web from "../../src/images/demo.jpg";

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
                    des={val.description}
                    campaignAddress={val.campaignAddress}
                    contractFactoryAddress={val.contractFactoryAddress}
                    manager={val.manager}
                    campaign={val}
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
