import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import axios from "axios";

const Profile = () => {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    factory_address: "",
  });

  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isUpdateLoading, setUpdateLoading] = useState(false);
  const [isLogoutLoading, setLogoutLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const user_email = getCurrentUser();
      const data = {
        email: user_email,
      };
      axios
        .post("http://localhost:8000/getUser", data, { withCredentials: true })
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            const user = response.data.user;
            setUser(user);
            const temp_data = {
              name: user.name,
              username: user.username,
              phone: user.phone,
              email: user.email,
              factory_address: user.myCampaignFactoryAddress,
            };
            setData(temp_data);
          }
        });
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
        const post_data = {
          email: data.email,
        };

        axios
          .post("http://localhost:8000/logout", post_data, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.isError) {
              console.log("Some error occured");
            } else {
              alert("Logged Out Successfully");
              navigate("/login");
              window.location.reload(true);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setFormDisabled(false);
            setLogoutLoading(false);
          });
      }
    } else if (btn === "update") {
      setUpdateLoading(true);
      user.name = data.name;
      user.email = data.email;
      user.username = data.username;
      user.phone = data.phone;
      user.myCampaignFactoryAddress = data.factory_address;

      const post_data = {
        email: data.email,
        user: user,
      };

      axios
        .post("http://localhost:8000/updateUser", post_data, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data.message);
          alert("Profile Updated Successfully.");
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          alert(error);
        })
        .finally(() => {
          console.log("Update Done");
          setFormDisabled(false);
          setUpdateLoading(false);
          window.location.reload(true);
        });
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

              <div className="col-md-12">
                
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  id="update"
                  disabled={isFormDisabled}
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    role="status"
                    style={isUpdateLoading ? {} : { display: "none" }}
                    aria-hidden="true"
                  ></span>
                  {isUpdateLoading ? (
                    <span>Updating...</span>
                  ) : (
                    <span>Update Information</span>
                  )}
                </button>
                <button
                  className="btn btn-outline-primary"
                  type="submit"
                  id="logout"
                  disabled={isFormDisabled}
                  style={{float:"right"}}
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
