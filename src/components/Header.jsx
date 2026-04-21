import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center p-2 bg-white shadow">
      <h2>Dashboard</h2>

      <div className="flex gap-4 justify-center items-center mr-[1rem]">
        <span>Welcome {user?.name}</span>
        <button
          className="bg-red-400 hover:bg-red-500 text-white py-2 px-2 mr-2
           rounded text-sm"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
