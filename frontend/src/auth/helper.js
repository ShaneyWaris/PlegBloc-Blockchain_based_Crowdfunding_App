import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

require("dotenv").config({
  path: "../../.env",
});

function isAuthenticated() {
  const token = Cookies.get("token");
  try {
    const payload = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    const email = payload.email;
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

export { isAuthenticated, getCurrentUser };
