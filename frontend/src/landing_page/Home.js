import React from "react";
import web from "../../src/images/img2.svg";
import Common from "./Common";

const Home = () => {
  return (
    <>
      <Common
        name="Grow your ventures with"
        des="PlegBloc is a trustful crowdfunding platform."
        imgsrc={web}
        visit="/login"
        link="internal"
        btname="Get Started"
      />
    </>
  );
};

export default Home;
