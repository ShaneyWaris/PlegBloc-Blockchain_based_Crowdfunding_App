import React from "react";
import web from "../../src/images/hero-img.png";
import Common from "./Common";

const About = () => {
  return (
    <>
      <Common
        name="Welcome to About Page"
        des="Visit the Project Wiki to know in detail."
        imgsrc={web}
        visit="https://github.com/AbhinavS99/PlegBloc/wiki"
        link="external"
        btname="Wiki"
      />
    </>
  );
};

export default About;
