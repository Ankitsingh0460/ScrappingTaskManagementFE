import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // ✅ wait for auth to load
  if (loading) return null; // or loader

  if (user?.forcePasswordChange) {
    return <Navigate to="/change-password" />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}
