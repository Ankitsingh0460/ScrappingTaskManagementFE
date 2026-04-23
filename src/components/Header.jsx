import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const messages = [
    "Let’s get things done 🚀",
    "Stay focused and keep building 💪",
    "Small steps, big results 🔥",
    "Make today productive ⚡",
    "You’re doing great, keep going 🙌",
    "Push your limits today 🚀",
  ];

  const dropdownRef = useRef();

  useEffect(() => {
    let index = 0;

    const startTimer = setTimeout(() => {
      setShowMessage(true);
      setMessage(messages[index]);

      const interval = setInterval(() => {
        index = (index + 1) % messages.length; // loop

        setMessage(messages[index]);
      }, 3000);

      return () => clearInterval(interval);
    }, 1000); // optional delay

    return () => clearTimeout(startTimer);
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b">
      {/* LEFT */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>

        <div className="flex items-center gap-2 h-[18px] overflow-hidden">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Welcome back 👋
          </span>

          <div
            className={`transition-opacity duration-500 font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 ${
              showMessage ? "opacity-100" : "opacity-0"
            }`}
          >
            {message}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative mr-4" ref={dropdownRef}>
        {/* PROFILE CLICK */}
        <div
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {/* new */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
            <span className="text-[11px] text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* 🔽 DROPDOWN */}
        {showDropdown && (
          <div className="absolute mt-4 right-0 top-full mt-1 w-[8rem] bg-white border rounded-lg shadow-lg py-1 z-50 hover:bg-red-600 hover:text-white transition">
            <button
              onClick={logout}
              className="w-full text-center px-4 py-1 text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
