import React, { useState } from "react";
import axios from "axios";

function VendorRegistration() {
  const [data, setData] = useState({
    name: "",
    email: "",
    website: "",
    description: "",
    address: "",
    isVerified: false,
  });

  const def_obj = {
    name: "",
    email: "",
    website: "",
    phone: "",
    description: "",
    address: "",
    isVerified: false,
  };

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

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormDisabled(true);

    axios
      .post("http://localhost:8000/vendorRegistration", data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.isError) {
          alert(response.data.message);
        } else {
          alert("Vendor Registered Successfully");
          setData(def_obj);
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
        <h1 className="text-center">Vendor Registration</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form onSubmit={formSubmit}>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Vendor Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="name"
                  value={data.name}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  placeholder="Enter the Vendor's Name"
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
                  disabled={isFormDisabled}
                  placeholder="name@example.com"
                  required
                />
                <div className="invalid-feedback">
                  Please provide a valid Email Address.
                </div>
              </div>

              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Vendor Website
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="name"
                  value={data.website}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  placeholder="Enter the Vendor's Website"
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
                <label for="exampleFormControlTextarea1" className="form-label">
                  Vendor Description
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="description"
                  value={data.description}
                  onChange={InputEvent}
                  placeholder="Any description that you want to provide regarding the vendor."
                  disabled={isFormDisabled}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">
                  Vendor Wallet Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="address"
                  value={data.address}
                  onChange={InputEvent}
                  placeholder="Enter the Wallet Address of Vendor"
                  disabled={isFormDisabled}
                  required
                />
              </div>
              <div className="col-12 mb-5">
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
                    <span>Register Vendor</span>
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

export default VendorRegistration;
