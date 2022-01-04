import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import hidden_eye from "../images/hidden.png";
import view_eye from "../images/view.png";

const LogIn = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

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
      .post("http://localhost:8000/signin", data, { withCredentials: true })
      .then((response) => {
        if (response.data.isError) {
          alert(response.data.message);
        } else {
          navigate("/allcontracts");
          window.location.reload(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
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
        <h1 className="text-center">Log In</h1>
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
                Password
              </label>
              <div className="input-group mb-3">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  id="exampleInputPassword1"
                  name="password"
                  value={data.password}
                  onChange={InputEvent}
                  placeholder="Password"
                  disabled={isFormDisabled}
                  required
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                  onClick={() => setShowPass(!showPass)}
                >
                  <img
                    style={{ height: "20px", width: "auto" }}
                    src={showPass ? hidden_eye : view_eye}
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
                  {isLoading ? <span>Logging In...</span> : <span>Log In</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
