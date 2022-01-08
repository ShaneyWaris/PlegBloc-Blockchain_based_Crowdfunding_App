import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const def_obj = {
    name: "",
    phone: "",
    email: "",
    msg: "",
  };
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    msg: "",
  });

  const InputEvent = (event) => {
    const { name, value } = event.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };
  const [isFormDisabled, setFormDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormDisabled(true);
    axios
      .post("http://localhost:8000/contact-us", data, { withCredentials: true })
      .then((response) => {
        alert("Message Sent Successfully");
        setData(def_obj);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        alert("Some unexpected error occured. Try again later.");
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
        <h1 className="text-center"> Contact Us</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form onSubmit={formSubmit}>
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Full Name
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
                  placeholder="Mobile number"
                  disabled={isFormDisabled}
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
                  placeholder="name@example.com"
                  required
                />
                <div className="invalid-feedback">
                  Please provide a valid Email Address.
                </div>
              </div>
              <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  name="msg"
                  value={data.msg}
                  onChange={InputEvent}
                  disabled={isFormDisabled}
                  required
                ></textarea>
              </div>
              <div className="col-12 text-center">
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
                  {isLoading ? <span>Submitting...</span> : <span>Submit</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
