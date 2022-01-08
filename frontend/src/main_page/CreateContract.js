import React, { useState, useEffect } from "react";
import { getCurrentUser, isAuthenticated } from "../auth/helper";
import axios from "axios";
import { createCampaign } from "../eth_scripts/core";

const CreateContract = () => {
  const default_obj = {
    name: "",
    description: "",
    type: "Others",
    min_amount: "",
    target_amount: "",
  };
  const [data, setData] = useState({
    name: "",
    description: "",
    type: "Others",
    min_amount: "",
    target_amount: "",
  });

  const [user, setUser] = useState({});
  const [selectFlag, setSelectFlag] = useState(true);

  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [usd, setUSD] = useState(0.0);

  const InputEvent = async (event) => {
    const { name, value } = event.target;

    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const typeChangeHandler = (event) => {
    event.preventDefault();
    setSelectFlag(false);
    const flag = parseInt(event.target.value);
    var _type = "Others";

    if (flag === 1) {
      _type = "Goverment Campaign";
    } else if (flag === 2) {
      _type = "Venture Capital Raising Campaign";
    } else if (flag === 3) {
      _type = "Social Cause Campaign";
    } else if (flag === 4) {
      _type = "Medical Campaign";
    } else if (flag == 5) {
      _type = "Others";
    }

    setData((preVal) => {
      return {
        ...preVal,
        type: _type,
      };
    });
  };

  useEffect(() => {
    axios
      .get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
      .then((response) => {
        setUSD(response.data.USD);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      const user_email = getCurrentUser();
      const post_data = {
        email: user_email,
      };
      axios
        .post("http://localhost:8000/getUser", post_data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.isError) {
            console.log(response.data.message);
          } else {
            const user = response.data.user;
            setUser(user);
          }
        });
    }
  }, []);

  const formSubmit = async (e) => {
    e.preventDefault();
    setFormDisabled(true);
    setLoading(true);
    if (parseInt(data.target_amount) < parseInt(data.min_amount)) {
      alert("Target Amount should be greater than Minimum Amount");
    } else {
      const address = await createCampaign(data.min_amount);
      if (address !== "") {
        const campaign = {
          manager: user.email,
          campaignAddress: address,
          contractFactoryAddress: user.myCampaignFactoryAddress,
          name: data.name,
          description: data.description,
          type: data.type,
          minAmount: data.min_amount,
          targetAmount: data.target_amount,
        };

        axios
          .post("http://localhost:8000/createCampaign", campaign, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.isError) {
              alert(response.data.message);
            } else {
              alert("Campaign Created Successfully.");
              setData(default_obj);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setFormDisabled(false);
            setLoading(false);
            setSelectFlag(true);
          });
      } else {
        setFormDisabled(false);
        setLoading(false);
      }
    }
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
                  Type of Campaign
                </label>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  onChange={typeChangeHandler}
                  disabled={isFormDisabled}
                >
                  <option selected={selectFlag} disabled={isFormDisabled}>
                    Choose Type of Campaign
                  </option>
                  <option value="1">Goverment Campaign</option>
                  <option value="2">Venture Capital Raising Campaign</option>
                  <option value="3">Social Cause Campaign</option>
                  <option value="4">Medical Campaign</option>
                  <option value="5">Others</option>
                </select>
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                Minimum Amount for Contribution
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="min_amount"
                  value={data.min_amount}
                  onChange={InputEvent}
                  placeholder="Eth"
                  disabled={isFormDisabled}
                  required
                />
                <span class="input-group-text">
                  $
                  {data.min_amount === ""
                    ? 0.0
                    : (parseFloat(data.min_amount) * usd).toFixed(4)}
                </span>
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                Target Amount
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="target_amount"
                  value={data.target_amount}
                  onChange={InputEvent}
                  placeholder="Eth"
                  disabled={isFormDisabled}
                  required
                />
                <span class="input-group-text">
                  $
                  {data.target_amount === ""
                    ? 0.0
                    : (parseFloat(data.target_amount) * usd).toFixed(5)}
                </span>
              </div>

              <div className="text-center">
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
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateContract;
