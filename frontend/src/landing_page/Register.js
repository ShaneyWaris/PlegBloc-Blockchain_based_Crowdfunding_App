import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCampaignFactory } from "../eth_scripts/core";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [passFlag, setPassFlag] = useState(0);

  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const InputEvent = (event) => {
    const { name, value } = event.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
    if (name === "password") {
      setPassFlag(1);
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormDisabled(true);
    if (data.password !== data.confirm_password) {
      alert("Password and Confirm Password must be same!");
      setFormDisabled(false);
      setLoading(false);
    } else {
      const campaignFactoryAddress = await createCampaignFactory();
      if (campaignFactoryAddress !== "") {
        const _data = {
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
          myCampaignFactoryAddress: campaignFactoryAddress,
        };

        axios
          .post("http://localhost:8000/signup", _data, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.isError) {
              alert(response.data.message);
            } else {
              alert(
                "Account Created Successfully. Verification Mail Sent to Registered Email Id. :)"
              );
              navigate("/login");
            }
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
      }
    }
    setLoading(false);
    setFormDisabled(false);
  };

  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Register</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form onSubmit={formSubmit}>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="name"
                  value={data.name}
                  onChange={InputEvent}
                  placeholder="Enter your name"
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                Username
              </label>
              <div className="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                  @
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="username"
                  value={data.username}
                  onChange={InputEvent}
                  placeholder="Username"
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                Phone
              </label>
              <div className="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                  +91
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="phone"
                  value={data.phone}
                  onChange={InputEvent}
                  placeholder="Mobile No"
                  disabled={isFormDisabled}
                  required
                />
              </div>
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
                  placeholder="name@example.com"
                  disabled={isFormDisabled}
                  required
                />
                <div className="invalid-feedback">
                  Please provide a valid Email Address.
                </div>
              </div>
              <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  name="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  required
                />
                <div id="passwordHelpBlock" class="form-text">
                  Your password must be 8-20 characters long, contain letters
                  and numbers, and must not contain spaces, special characters,
                  or emoji.
                </div>
              </div>
              <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={data.confirm_password}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  required
                />
                {passFlag === 1 && data.confirm_password === data.password && (
                  <div
                    id="passwordHelpBlock2"
                    class="form-text"
                    style={{ color: "green" }}
                  >
                    &#10003; Password and Confirm Password match.
                  </div>
                )}
                {passFlag === 1 && data.confirm_password !== data.password && (
                  <div
                    id="passwordHelpBlock2"
                    class="form-text"
                    style={{ color: "red" }}
                  >
                    &#x2718; Password and Confirm Password do not match.
                  </div>
                )}
              </div>
              <div className="col-12">
                <button
                  className="btn btn-outline-primary mb-5"
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
                    <span>Registering...</span>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
