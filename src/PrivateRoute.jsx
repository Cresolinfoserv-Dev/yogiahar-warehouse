import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAdminLoggedIn = sessionStorage.getItem("adminToken");

  return isAdminLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
