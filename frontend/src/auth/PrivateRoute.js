import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./helper";

function PrivateRoute({ children }) {
  const auth = isAuthenticated();
  return auth ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
