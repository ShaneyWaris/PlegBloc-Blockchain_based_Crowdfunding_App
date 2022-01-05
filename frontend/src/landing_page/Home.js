import React from "react";
import { Link } from "react-router-dom";
import web from "../../src/images/home.jpg";
import Common from "./Common";

const Home = () => {
  return (
    <>
      <Common
        name="Grow your ventures with"
        des="Let people gain more trust in crowdfunding via PlegBloc"
        imgsrc={web}
        visit="/login"
        link="internal"
        btname="Get Started"
      />
      <div className="container">
      <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 class="display-4 fw-normal">Create Campaign in Just 3 steps...</h1>
        <p class="fs-5 text-muted mt-4">Our product is easy to use. All you need is Metamask account. <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank">Click here</a> to install Metamask web extension.</p></div>
    
      <main>
        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
          <div className="col">
            {/* <div className="card mb-4 rounded-3 shadow-sm">
              <div className="card-header py-3"> */}
              <div className="card mb-4 rounded-3 shadow-sm border-primary">
              <div className="card-header py-3 text-white bg-primary border-primary">
                <h4 className="my-0 fw-normal">1. Sign Up</h4>
              </div>
              <div className="card-body">
                <p>Crete your PlegBloc account by filling your name, username, email, phone number, password in sign up page. This will require metamask web extension to pay the gas amount.</p>
                {/* <h1 className="card-title pricing-card-title">$0<small className="text-muted fw-light">/mo</small></h1> */}
                {/* <ul className="list-unstyled mt-3 mb-4">
                  <li>10 users included</li>
                  <li>2 GB of storage</li>
                  <li>Email support</li>
                  <li>Help center access</li>
                </ul> */}
                {/* <button type="button" className="w-100 btn btn-lg btn-outline-primary">Sign up for free</button> */}
              </div>
            </div>
          </div>
          <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm border-primary">
              <div className="card-header py-3 text-white bg-primary border-primary">
                <h4 className="my-0 fw-normal">2. Authorize  Yourself</h4>
              </div>
              <div className="card-body">
                <p>We are using two factor Authentication at each step. After signup, you need to verify your email within 2 minutes and then install Google/Microsoft/Authy authenticator app for OTP.</p>
                {/* <h1 className="card-title pricing-card-title">$15<small className="text-muted fw-light">/mo</small></h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>20 users included</li>
                  <li>10 GB of storage</li>
                  <li>Priority email support</li>
                  <li>Help center access</li>
                </ul> */}
                {/* <button type="button" className="w-100 btn btn-lg btn-primary">Get started</button> */}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card mb-4 rounded-3 shadow-sm border-primary">
              <div className="card-header py-3 text-white bg-primary border-primary">
                <h4 className="my-0 fw-normal">3. Create Campaign</h4>
              </div>
              <div className="card-body">
                <p>Create campaign by filling the required details, after receiving the targeted amount set by you, money will be transfered to vendor's account if it gets more than 50% votes by contributors.</p>
                {/* <h1 className="card-title pricing-card-title">$29<small className="text-muted fw-light">/mo</small></h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>30 users included</li>
                  <li>15 GB of storage</li>
                  <li>Phone and email support</li>
                  <li>Help center access</li>
                </ul> */}
                {/* <button type="button" className="w-100 btn btn-lg btn-primary">Contact us</button> */}
              </div>
            </div>
          </div>
        </div>
        <br></br><br></br>
      </main>

      <div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Why PlegBloc?</h1>
        <p class="col-md-8 fs-4">How plegbloc is solving the issue?</p>
        {/* <button class="btn btn-primary btn-lg" type="button">Example button</button> */}
      </div>
    </div>

    </div>
    </>
  );
};

export default Home;
