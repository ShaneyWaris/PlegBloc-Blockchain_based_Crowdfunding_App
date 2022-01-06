import React from "react";
import { Link } from "react-router-dom";
import web from "../../src/images/home.jpg";
import logo from "../../src/images/final-logo.png";
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
          <h1 class="display-4 fw-normal">
            Create a Campaign in Just 3 Steps...
          </h1>
          <p class="fs-5 text-muted mt-4">
            <strong className="brand-name"> PlegBloc </strong> is easy to use.
            All you need is a Metamask account.{" "}
            <a
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
              target="_blank"
            >
              Click here
            </a>{" "}
            to install the Metamask web extension.
          </p>
        </div>

        <main>
          <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm border-primary">
                <div className="card-header py-3 text-white bg-primary border-primary">
                  <h4 className="my-0 fw-normal">1. Register</h4>
                </div>
                <div className="card-body">
                  <p style={{ textAlign: "justify" }}>
                    Create a PlegBloc account by filling your name, username,
                    email, phone number, password in Registration Page. This
                    will require{" "}
                    <a
                      href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
                      target="_blank"
                    >
                      Metamask Web Extension
                    </a>{" "}
                    to pay the registration gas.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm border-primary">
                <div className="card-header py-3 text-white bg-primary border-primary">
                  <h4 className="my-0 fw-normal">2. Authenticate Yourself</h4>
                </div>
                <div className="card-body">
                  <p style={{ textAlign: "justify" }}>
                    We are using two factor Authentication at each step. After
                    signup, you need to verify your email within two minutes and
                    then install Google/Microsoft/Authy authenticator app for
                    OTP.
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm border-primary">
                <div className="card-header py-3 text-white bg-primary border-primary">
                  <h4 className="my-0 fw-normal">3. Create Campaign</h4>
                </div>
                <div className="card-body">
                  <p style={{ textAlign: "justify" }}>
                    Create a campaign by filling the required details. Issue
                    requests within a campaign to utilize funds. Hold the vote
                    among the investors and proceed ahead after the majority
                    votes in favour.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
        </main>

        <div class="p-5 mb-4 bg-light rounded-3">
          <div class="container-fluid py-5">
            <h1 class="display-5 fw-bold">Why PlegBloc?</h1>
            <table>
              <tr>
                <td>
                  <p
                    class="col-md-12 fs-4"
                    style={{ textAlign: "justify", marginTop: "2rem" }}
                  >
                    <ul>
                      <li>
                        PlegBloc upholds the principle of trustful crowdfunding
                        by enabling the investors to decide the place where the
                        capital can be spent.
                      </li>
                      <li>
                        To use the capital, a venture has to request a vote from
                        all the investors by providing all the details about the
                        expenses. The investors can then verify the credibility
                        of this expense and then post their vote accordingly.
                      </li>
                      <li>
                        For the venture to execute the expense it must have a
                        positive vote from the majority of the investors.
                      </li>
                      <li>
                        In this way, the capital of the investors is safe and
                        they are aware of all the expense details as the venture
                        is required to furnish them for holding a vote.
                      </li>
                      <li>
                        Thus investors have transparency and control over their
                        funds. The currency of exchange on PlegBloc is Ether.
                      </li>
                    </ul>
                  </p>
                </td>
                <td className="col-md-4 " style={{ textAlign: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <img src={logo} alt="" style={{ height: "20rem" }} />
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
