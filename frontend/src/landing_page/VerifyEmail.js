import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [qr_code, setQrCode] = useState("");
  const [email, setEmail] = useState("");
  const [visib, setVisib] = useState("hidden");
  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    otp: "",
  });

  const navigate = useNavigate();

  const InputEvent = (event) => {
    const { name, value } = event.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const path_bits = window.location.href.split("/");
    const otp = path_bits.at(-1);
    const email = path_bits.at(-2);
    setEmail(email);

    const _data = {
      email: email,
      otp: otp,
    };
    axios
      .post("http://localhost:8000/verifyEmail", _data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.isError) {
          alert(response.data.message);
          window.close();
        } else {
          alert("Email Verified Successfully");
          const qr_code = response.data.qr_code;
          setQrCode(qr_code);
          console.log(qr_code);
          setVisib("visible");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        alert("Some Unexpected error occured");
      });
  }, []);

  const submitOtp = async (e) => {
    e.preventDefault();

    if (data.otp !== "") {
      setFormDisabled(true);
      setLoading(true);
      const _data = { email: email, otp: data.otp };
      axios
        .post("http://localhost:8000/verifyAuthyOtp", _data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.isError) {
            alert(response.data.message);
          } else {
            navigate("/login");
            alert("Verification Successful. :)");
          }
        })
        .catch((error) => {
          alert("Some unexpected error occured. :/");
          console.error("Error fetching data: ", error);
          console.log(error);
        })
        .finally(() => {
          setFormDisabled(false);
          setLoading(false);
          console.log("Done");
        });
    } else {
      alert("Please enter the otp. :/");
    }
  };

  return (
    <div style={{ visibility: visib, overflowX: "scroll" }}>
      <div className="my-5">
        <h1 className="text-center">Two Factor Authentication</h1>
      </div>

      <section class="mb-5">
        <div class="row">
          <div className="col ms-5">
            <h3>{"Steps to Follow"}</h3>
            <br />
            <p style={{ textAlign: "justify" }}>
              1. Thanks for verifying your email ID. This is the <b>Important</b> as well as the last stage of
              verification. Please do not close this page.
              <br />
              <br />
              2. Since we are working in the finance domain, we take security as
              our utmost priority. So now you need to download the “authy”
              application. It is available in the Play Store, Apple store and as
              a web application too.
              <br />
              <ul>
                <li>
                  PlayStore Link :{" "}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.authy.authy "
                    target="_blank"
                  >
                    https://play.google.com/store/apps/details?id=com.authy.authy{" "}
                  </a>
                </li>
                <li>
                  App Store Link :{" "}
                  <a
                    href="https://apps.apple.com/in/app/twilio-authy/id494168017"
                    target="_blank"
                  >
                    https://apps.apple.com/in/app/twilio-authy/id494168017
                  </a>
                </li>
                <li>
                  Web application Link :{" "}
                  <a href="https://authy.com/download/" target="_blank">
                    https://authy.com/download/
                  </a>
                </li>
              </ul>
              <br />
              3. Create your account in authy and after a successful creation of
              your account, you need to scan this QR Code.
              <br />
              <br />
              4. After scanning, you will get a 6 digit OTP, which you need to
              enter below and hit the submit button.
              <br />
              <br />
              5. Please enable the backup option in the accounts tab in Authy app. So that even if you accidently uninstall
              the app OR if you do not have the access of your mobile in future. You can recover all your authy accounts easily
              when you will install it again.
              <br/>
              <br/>
              6. We would recommend Authy app only because of its backup and security features, but you can also use "Google Authenticator" or "Microsoft Authenticator" apps as well.
            </p>
          </div>

          <div class="col">
            <div className="mdb-lightbox">
              <div className="row center mx-1" style={{ textAlign: "center" }}>
                <div className="col ms-2" style={{ textAlign: "center" }}>
                  <figure className="view overlay rounded z-depth-1">
                    <img
                      src={qr_code}
                      className="img-fluid z-depth-1"
                      style={{ height: 15 + "rem" }}
                    />
                  </figure>
                  <div
                    className="input-group mb-3"
                    style={{
                      textAlign: "center",
                      width: "40%",

                      marginLeft: "13rem",
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter OTP"
                      aria-label="Recipient's username"
                      name="otp"
                      value={data.otp}
                      onChange={InputEvent}
                      disabled={isFormDisabled}
                      required
                      aria-describedby="button-addon2"
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="submit"
                      onClick={submitOtp}
                      id="button-addon2"
                    >
                      <span
                        class="spinner-grow spinner-grow-sm"
                        role="status"
                        style={isLoading ? {} : { display: "none" }}
                        aria-hidden="true"
                      ></span>
                      {isLoading ? <span></span> : <span>Submit</span>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;
