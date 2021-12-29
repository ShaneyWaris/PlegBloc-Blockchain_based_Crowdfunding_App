import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getUserInfo, isAuthenticated } from "../auth/helper";

const Profile = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    factory: "",
  });

  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLogoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUserInfo();
      setData(user);
    }
  }, []);

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
    setFormDisabled(true);
    const btn = document.activeElement.getAttribute("id");
    if (btn === "logout") {
      setLogoutLoading(true);
      if (isAuthenticated()) {
        deleteCookie();
        alert("Logged Out Successfully");
        navigate("/login");
        window.location.reload(true);
        setFormDisabled(false);
        setLogoutLoading(false);
      }
    }
  };
  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Profile</h1>
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
                  disabled
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
                  disabled
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
                  disabled
                />
                <div className="invalid-feedback">
                  Please provide a valid Email Address.
                </div>
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Campaign Factory
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="factory"
                  value={data.factory}
                  onChange={InputEvent}
                  placeholder="Campaign Factory Address"
                  disabled
                />
                <div className="invalid-feedback">
                  Please provide a valid Email Address.
                </div>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  id="logout"
                  disabled={isFormDisabled}
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    role="status"
                    style={isLogoutLoading ? {} : { display: "none" }}
                    aria-hidden="true"
                  ></span>
                  {isLogoutLoading ? (
                    <span>Logging Out...</span>
                  ) : (
                    <span>Log Out</span>
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

export default Profile;
