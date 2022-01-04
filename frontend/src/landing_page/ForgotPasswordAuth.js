import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import hidden_eye from "../images/hidden.png";
import view_eye from "../images/view.png";

function ForgotPasswordAuth() {
  const [data, setData] = useState({
    email: "",
    otp: "",
  });
  const [showOTP, setShowOTP] = useState(false);

  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
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

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormDisabled(true);

    axios
      .post("http://localhost:8000/forgotPassword", data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.isError) {
          alert(response.data.message);
        } else {
          navigate("/updatePassword", {
            state: {
              email: data.email,
            },
          });
          window.location.reload(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        alert("Some Unexpected Error Occured. :/");
        console.log(error);
      })
      .finally(() => {
        setFormDisabled(false);
        setLoading(false);
        console.log("Done");
      });
  };
  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Forgot Password</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form onSubmit={formSubmit}>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="email"
                  value={data.email}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  placeholder="name@example.com"
                  required
                />
                <div className="invalid-feedback">
                  Please provide a valid Email Address.
                </div>
              </div>
              <label for="exampleInputPassword1" className="form-label">
                Two Factor Authentication OTP
              </label>
              <div className="input-group mb-3">
                <input
                  type={showOTP ? "text" : "password"}
                  className="form-control"
                  id="exampleInputPassword1"
                  name="otp"
                  value={data.otp}
                  onChange={InputEvent}
                  placeholder="OTP"
                  disabled={isFormDisabled}
                  required
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                  onClick={() => setShowOTP(!showOTP)}
                >
                  <img
                    style={{ height: "20px", width: "auto" }}
                    src={showOTP ? hidden_eye : view_eye}
                  />
                </button>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  disabled={isFormDisabled}
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    role="status"
                    style={isLoading ? {} : { display: "none" }}
                    aria-hidden="true"
                  ></span>
                  {isLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordAuth;
