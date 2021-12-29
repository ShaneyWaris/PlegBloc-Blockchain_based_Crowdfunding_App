import React, { useState, useEffect } from "react";
import { getUserInfo, isAuthenticated } from "../auth/helper";
import { createCampaign } from "../eth_scripts/core";

const CreateContract = () => {
  const default_obj = {
    name: "",
    description: "",
    min_amount: "",
    target_amount: "",
  };
  const [data, setData] = useState({
    name: "",
    description: "",
    min_amount: "",
    target_amount: "",
  });

  const [user, setUser] = useState({});

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

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUserInfo();
      setUser(user);
    }
  }, []);

  const formSubmit = async (e) => {
    e.preventDefault();
    setFormDisabled(true);
    setLoading(true);
    if (parseInt(data.target_amount) < parseInt(data.min_amount)) {
      alert("Target Amount should be greater than Minimum Amount");
    } else {
      const campaign_address = await createCampaign(
        user.email,
        data.name,
        data.description,
        data.min_amount,
        data.target_amount,
        user.factory
      );
      if (campaign_address == -1) {
        alert("Campaign Creation Failed. :/");
      } else {
        alert("Campaign Created Successfully. :)");
        setData(default_obj);
      }
    }
    setFormDisabled(false);
    setLoading(false);
  };

  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Create Campaign</h1>
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
                  placeholder="Enter Campaign Name"
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="description"
                  value={data.description}
                  onChange={InputEvent}
                  placeholder="Enter Campaign Description"
                  disabled={isFormDisabled}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Minimum Amount for Contribution
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="min_amount"
                  value={data.min_amount}
                  onChange={InputEvent}
                  placeholder="Wei"
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Target Amount
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="target_amount"
                  value={data.target_amount}
                  onChange={InputEvent}
                  placeholder="Wei"
                  disabled={isFormDisabled}
                  required
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
                    <span className="ms 3">Creating Campaign...</span>
                  ) : (
                    <span>Create Campaign</span>
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

export default CreateContract;
