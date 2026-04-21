import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let interval;

    // ⏱ Start after 10 sec
    const startTimer = setTimeout(() => {
      setShowMessage(true);

      // 🔁 Loop every 6 sec (3 sec show + 3 sec hide)
      interval = setInterval(() => {
        setShowMessage((prev) => !prev);
      }, 3000);
    }, 10000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b">
      {/* LEFT */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>

        <div className="flex items-center gap-2 h-[18px] overflow-hidden">
          <span className="text-xs text-gray-500">Welcome back 👋</span>

          {/* 🔥 Animated Loop Message */}
          <span
            className={`text-xs text-indigo-500 transition-all duration-500 ${
              showMessage
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-3"
            }`}
          >
            • Let’s get things done 🚀
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER */}
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
            <span className="text-[11px] text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
