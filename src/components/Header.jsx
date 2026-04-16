import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <h2>Dashboard</h2>

      <div className="flex gap-4">
        <span>{user?.email}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}