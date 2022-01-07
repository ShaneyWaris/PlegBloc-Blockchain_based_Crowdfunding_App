import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ManagerInfo() {
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state === null) {
      navigate("/allcontracts");
    } else {
      const { email } = state;
      const data = {
        email: email,
      };
      axios
        .post("http://localhost:8000/getUser", data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            const _user = response.data.user;
            console.log(_user.myCreatedCampaigns);
            setUser(_user);
          }
        });
    }
  }, []);

  const onViewCampaignClick = (e) => {
    e.preventDefault();
    const url = `/campaigns/${user.email}`;
    navigate(url, {
      state: {
        email: user.email,
      },
    });
  };
  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Manager Details</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="name"
                  value={user.name}
                  placeholder="Enter your name"
                  disabled
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
                  value={user.username}
                  onChange={InputEvent}
                  placeholder="Username"
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
                  value={user.phone}
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
                  value={user.email}
                  placeholder="name@example.com"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Campaign Factory Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="factory_address"
                  value={user.myCampaignFactoryAddress}
                  disabled
                />
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                No. of Campaigns
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="factory_address"
                  value={
                    user.myCreatedCampaigns === undefined
                      ? 0
                      : user.myCreatedCampaigns.length
                  }
                  disabled
                />
                <button
                  class="btn btn-outline-primary ms-3"
                  type="button"
                  id="button-addon2"
                  onClick={onViewCampaignClick}
                >
                  View Campaigns &#8594;
                </button>
              </div>
              <div className="col-12"></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerInfo;
