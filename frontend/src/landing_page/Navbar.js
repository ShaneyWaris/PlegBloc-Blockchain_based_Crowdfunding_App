import React from "react";
import { NavLink } from "react-router-dom";
// import logo from "../../src/images/logo.png";

const Navbar = () => {
  return (
    <>
      <div className="container-fluid nav_bg">
        <div className="row">
          <div className="col-10 mx-auto">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
              {/* <div className="" style={{width:"125px"}}>
                  <img
                    src={logo}
                    className="img-fluid animated"
                    alt=""
                  />
                </div> */}
                <NavLink end className="navbar-brand" to="/">
                  PlegBloc
                </NavLink>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <NavLink
                        end
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " menu_active" : "")
                        }
                        aria-current="page"
                        to="/"
                      >
                        Home
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " menu_active" : "")
                        }
                        to="/login"
                      >
                        Login
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " menu_active" : "")
                        }
                        to="/register"
                      >
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " menu_active" : "")
                        }
                        to="/about"
                      >
                        About
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " menu_active" : "")
                        }
                        to="/contact"
                      >
                        Contact
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
