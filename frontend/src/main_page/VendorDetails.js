import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VendorDetails() {
  const navigate = useNavigate();
  const [_vendor, setVendor] = useState({
    name: "",
    email: "",
    website: "",
    phone: "",
    description: "",
    address: "",
    manager: "",
  });

  useEffect(() => {
    const path_bits = window.location.href.split("/");
    const addr = path_bits.at(-1);
    axios
      .post(
        "http://localhost:8000/getVendor",
        { address: addr },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.isError) {
          alert(response.data.message);
          navigate("/allcontracts");
        } else {
          setVendor(response.data.vendor);
        }
      })
      .catch((err) => {
        alert("Some Unexpected Error Occured. Please try after some time.");
        navigate("/allcontracts");
      });
  }, []);

  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Vendor Details</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Vendor Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="name"
                  value={_vendor.name}
                  onChange={InputEvent}
                  disabled
                />
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                Email address
              </label>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="email"
                  value={_vendor.email}
                  disabled
                />
                <a
                  href={"mailto:" + _vendor.email}
                  className="btn btn-outline-primary"
                  target="_blank"
                >
                  &#8594;
                </a>
              </div>
              <label for="exampleFormControlInput1" className="form-label">
                Vendor Website
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="website"
                  value={_vendor.website}
                  disabled
                />
                <a
                  href={_vendor.website}
                  className="btn btn-outline-primary"
                  target="_blank"
                >
                  &#8594;
                </a>
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
                  value={_vendor.phone}
                  disabled
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
                  value={_vendor.description}
                  disabled
                ></textarea>
              </div>
              <label for="exampleFormControlTextarea1" className="form-label">
                Vendor Wallet Address
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  name="address"
                  value={_vendor.address}
                  disabled
                />
                <a
                  href={
                    "https://rinkeby.etherscan.io/address/" + _vendor.address
                  }
                  className="btn btn-outline-primary"
                  target="_blank"
                >
                  &#8594;
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDetails;
