import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import axios from "../api/axios";
import dayjs from "dayjs";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const dropdownRef = useRef();
  const notifRef = useRef();

  const messages = [
    "Let’s get things done 🚀",
    "Stay focused and keep building 💪",
    "Small steps, big results 🔥",
    "Make today productive ⚡",
    "You’re doing great, keep going 🙌",
    "Push your limits today 🚀",
  ];

  // ✅ Welcome message
  useEffect(() => {
    let index = 0;

    const startTimer = setTimeout(() => {
      setShowMessage(true);
      setMessage(messages[index]);

      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setMessage(messages[index]);
      }, 3000);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startTimer);
  }, []);

  // ✅ FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data);

      const unreadCount = res.data.filter((n) => !n.isRead).length;
      setUnread(unreadCount);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ✅ SOCKET
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnread((prev) => prev + 1);

      // 🔔 WINDOWS NOTIFICATION
      if (Notification.permission === "granted") {
        new Notification("🔔 New Notification", {
          body: data.message,
          icon: "/logo.png", // optional (put in public folder)
        });
      }
    });

    fetchNotifications();

    return () => socket.off("new_notification");
  }, [user]);

  // ✅ MARK READ
  const markAsRead = async (id) => {
    await axios.put(`/notifications/read/${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnread((prev) => Math.max(prev - 1, 0));
  };

  // ✅ CLEAR ALL
  const clearAllNotifications = async () => {
    try {
      if (!notifications.length) return;

      const confirmClear = window.confirm(
        "Are you sure you want to clear all notifications?",
      );
      if (!confirmClear) return;

      await axios.delete("/notifications/clear-all");

      setNotifications([]);
      setUnread(0);
    } catch (err) {
      console.error("Clear notification error:", err);
    }
  };

  // ✅ GROUP
  const groupNotifications = () => {
    const groups = {};

    notifications.forEach((n) => {
      const date = dayjs(n.createdAt);

      let key = "Older";
      if (date.isSame(dayjs(), "day")) key = "Today";
      else if (date.isSame(dayjs().subtract(1, "day"), "day"))
        key = "Yesterday";

      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    return groups;
  };

  // ✅ CLOSE OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const grouped = groupNotifications();

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b">
      {/* LEFT */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>

        <div className="flex items-center gap-2 h-[18px] overflow-hidden">
          <span className="text-sm text-gray-500">Welcome back 👋</span>

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
      <div className="flex items-center gap-4">
        {/* 🔔 NOTIFICATION */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <IoMdNotifications size={20} />

            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unread}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotif && (
            <div className="absolute right-0 mt-3 w-96 bg-white border rounded-xl shadow-xl h-[420px] flex flex-col z-50">
              {/* HEADER */}
              <div className="flex justify-between items-center px-4 py-3 border-b bg-white">
                <p className="text-sm font-semibold">Notifications</p>

                <button
                  onClick={clearAllNotifications}
                  disabled={!notifications.length}
                  className={`text-xs ${
                    notifications.length
                      ? "text-red-500 hover:text-red-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Clear All
                </button>
              </div>

              {/* SCROLLABLE LIST */}
              <div className="overflow-y-auto flex-1 mb-2 rounded-b-xl">
                {notifications.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No notifications
                  </div>
                )}

                {Object.keys(grouped).map((day) => (
                  <div key={day}>
                    <p className="text-xs text-gray-400 px-4 py-2 sticky top-0 bg-white z-10">
                      {day}
                    </p>

                    {grouped[day].map((n) => (
                      <Link to="/tasks" key={n._id}>
                        <div
                          onClick={() => markAsRead(n._id)}
                          className={`px-4 py-3 cursor-pointer border-l-4 min-h-[80px] ${
                            !n.isRead
                              ? "bg-blue-50 border-blue-500"
                              : "border-transparent hover:bg-gray-50"
                          }`}
                        >
                          <p className="text-sm text-gray-700 break-words">
                            {n.message}
                          </p>

                          <p className="text-[10px] text-gray-400 mt-1">
                            {dayjs(n.createdAt).format("hh:mm A")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 mr-4">
          {/* USER BOX */}
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.toUpperCase()}
              </span>
              <span className="text-[11px] text-gray-500 capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          {/* LOGOUT BUTTON (MATCH HEIGHT) */}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm flex items-center justify-center hover:bg-red-600 transition min-h-[38px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
