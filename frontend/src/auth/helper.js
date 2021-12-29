import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

require("dotenv").config();
require("dotenv").config({
  path: "../../.env",
});

function setCookie(obj) {
  const _token = jwt.sign(obj, process.env.REACT_APP_JWT_SECRET, {
    expiresIn: process.env.REACT_APP_JWTtokenExpiryTime,
  });
  console.log("token is ", _token);
  Cookies.set("token", _token);
}

function isAuthenticated() {
  const token = Cookies.get("token");
  try {
    const payload = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Call after checking isAuthenticated
function getCurrentUser() {
  const token = Cookies.get("token");
  const payload = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
  const email = payload.email;
  return email;
}

function getUserInfo() {
  const token = Cookies.get("token");
  const payload = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
  return payload;
}

function deleteCookie() {
  Cookies.remove("token");
}

export {
  isAuthenticated,
  getCurrentUser,
  setCookie,
  deleteCookie,
  getUserInfo,
};
