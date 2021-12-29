import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  };

  const formSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setFormDisabled(true);
    if (data.password !== data.confirm_password) {
      alert("Password and Confirm Password must be same!");
      setFormDisabled(false);
      setLoading(false);
    } else {
      const _data = {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      axios
        .post("http://localhost:8000/signup", _data, { withCredentials: true })
        .then((response) => {
          if (response.data.isError) {
            alert(response.data.message);
          } else {
            alert("Account Created Successfully. Redirecting to Login.");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
        .finally(() => {
          setFormDisabled(false);
          setLoading(false);
          console.log("Done");
        });
    }
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
                />
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="username"
                  value={data.username}
                  onChange={InputEvent}
                  placeholder="Username"
                  disabled={isFormDisabled}
                />
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="phone"
                  value={data.phone}
                  onChange={InputEvent}
                  placeholder="Mobile No"
                  disabled={isFormDisabled}
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
                />
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
                />
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
