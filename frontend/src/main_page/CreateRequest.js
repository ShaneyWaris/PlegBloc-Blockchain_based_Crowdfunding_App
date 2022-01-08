import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { createRequest } from "../eth_scripts/core";
import axios from "axios";

function CreateRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const def_obj = {
    title: "",
    description: "",
    amount: "",
  };
  const [data, setData] = useState(def_obj);
  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectFlag, setSelectFlag] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [currVendor, setCurrVendor] = useState({});
  const [usd, setUSD] = useState(0.0);

  useEffect(() => {
    axios
      .get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
      .then((response) => {
        setUSD(response.data.USD);
      });
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

  useEffect(() => {
    if (state === null) {
      navigate("/allcontracts");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:8000/getVendors", {}, { withCredentials: true })
      .then((response) => {
        if (response.data.isError) {
          console.log(response.data.message);
        } else {
          setVendors(response.data.vendors);
        }
      });
  }, []);

  const vendorChangeHandler = (e) => {
    e.preventDefault();
    const flag = parseInt(e.target.value);

    if (flag === 0) {
      setSelectFlag(true);
      setCurrVendor({});
    } else {
      setSelectFlag(false);
      setCurrVendor(vendors.at(flag - 1));
    }
  };

  const vendorDetailClick = (e) => {
    e.preventDefault();
    console.log(currVendor);
    const url = "http://localhost:3000/vendors/" + currVendor.address;
    window.open(url, "_blank");
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setFormDisabled(true);
    setLoading(true);

    if (isAuthenticated()) {
      const { manager, campaignAddress, numRequests, currentContribution } =
        state;
      if (parseFloat(currentContribution) > parseFloat(data.amount)) {
        if (!selectFlag) {
          const recipient = currVendor.address;
          const flag = await createRequest(
            data.amount,
            recipient,
            campaignAddress
          );
          if (flag == 1) {
            const _data = {
              index: numRequests,
              title: data.title,
              description: data.description,
              amount: data.amount,
              vendorName: currVendor.name,
              vendorAddress: currVendor.address,
              campaignAddress: campaignAddress,
            };
            axios
              .post("http://localhost:8000/createRequest", _data, {
                withCredentials: true,
              })
              .then((response) => {
                if (response.data.isError) {
                  alert(response.data.message);
                } else {
                  alert("Request Created Successfully. :)");
                }
              })
              .catch((err) => {
                alert(
                  "Some Unexpected Error Occured. Please try after some time."
                );
              });

            setData(def_obj);
            setSelectFlag(true);
          } else {
            alert("Error in Creating Request. :/");
          }
        } else {
          alert("Please choose a vendor.");
        }
      } else {
        alert(
          "Amount requested should not be more than the current contribution the campaign"
        );
      }
    }
    setFormDisabled(false);
    setLoading(false);
  };

  return (
    <div>
      <div className="my-5">
        <h1 className="text-center">Create Request</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form onSubmit={formSubmit}>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="title"
                  value={data.title}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  placeholder="Title of the Request"
                  required
                />
              </div>

              <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="description"
                  placeholder="Enter the description of the request"
                  value={data.description}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  required
                ></textarea>
              </div>

              <label for="exampleFormControlInput1" className="form-label">
                Amount Requested
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="amount"
                  value={data.amount}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  placeholder="Eth"
                  required
                />
                <span class="input-group-text">
                  $
                  {data.amount === ""
                    ? 0.0
                    : (parseFloat(data.amount) * usd).toFixed(2)}
                </span>
              </div>

              <label for="exampleFormControlInput1" className="form-label">
                Vendor
              </label>
              <div className="input-group mb-3">
                <select
                  class="form-select"
                  aria-label="Default select example"
                  onChange={vendorChangeHandler}
                  disabled={isFormDisabled}
                >
                  <option selected={selectFlag} value="0">
                    Choose Vendor
                  </option>
                  {vendors.map((val, ind) => {
                    return <option value={ind + 1}>{val.name}</option>;
                  })}
                </select>
                <button
                  className="btn btn-outline-primary"
                  id="button-addon2"
                  type="button"
                  disabled={selectFlag}
                  onClick={vendorDetailClick}
                >
                  Details &#8594;
                </button>
              </div>

              <div className="col-12">
                <div className="text-center">
                  <button
                    className="btn btn-outline-primary text-center"
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
                      <span>Creating Request...</span>
                    ) : (
                      <span>Create Request</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRequest;
