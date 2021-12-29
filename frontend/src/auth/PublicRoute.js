import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./helper";

function PublicRoute({ children }) {
  const auth = !isAuthenticated();
  return auth ? children : <Navigate to="/allcontracts" />;
}

export default PublicRoute;
