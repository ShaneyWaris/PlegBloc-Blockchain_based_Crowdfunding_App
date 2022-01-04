import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function UpdatePassword() {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [data, setData] = useState({
    password: "",
    confirm_password: "",
  });

  const [passFlag, setPassFlag] = useState(0);

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
    if (name === "password") {
      setPassFlag(1);
    }
  };

  useEffect(() => {
    if (state === null) {
      navigate("/login");
    }
  }, []);

  const formSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirm_password) {
      alert("Password and Confirm Password must be same!");
    } else {
      setLoading(true);
      setFormDisabled(true);

      const _data = { email: state.email, password: data.password };
      axios
        .post("http://localhost:8000/updatePassword", _data, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.isError) {
            alert(response.data.message);
          } else {
            alert("Password Updated Successfully. :)");
            navigate("/login");
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
    }
  };

  return (
    <>
      <div className="my-5">
        <h1 className="text-center">Update Password</h1>
      </div>
      <div className="container contact_div">
        <div className="row">
          <div className="col-md-6 col-10 mx-auto">
            <form onSubmit={formSubmit}>
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
                  required
                />
                <div id="passwordHelpBlock" class="form-text">
                  Your password must be 8-20 characters long, contain letters
                  and numbers, and must not contain spaces, special characters,
                  or emoji.
                </div>
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
                  required
                />
                {passFlag === 1 && data.confirm_password === data.password && (
                  <div
                    id="passwordHelpBlock2"
                    class="form-text"
                    style={{ color: "green" }}
                  >
                    &#10003; Password and Confirm Password match.
                  </div>
                )}
                {passFlag === 1 && data.confirm_password !== data.password && (
                  <div
                    id="passwordHelpBlock2"
                    class="form-text"
                    style={{ color: "red" }}
                  >
                    &#x2718; Password and Confirm Password do not match.
                  </div>
                )}
              </div>
              <div className="col-12">
                <button
                  className="btn btn-outline-primary mb-5"
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
                    <span>Updating Password...</span>
                  ) : (
                    <span>Update Password</span>
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

export default UpdatePassword;
