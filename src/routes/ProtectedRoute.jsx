import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const user = JSON.parse(localStorage.getItem("user"));
export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);


if (user?.forcePasswordChange) {
  return <Navigate to="/change-password" />;
}
  if (!user) return <Navigate to="/" />;

  return children;
}