import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ NEW
  const [error, setError] = useState(""); // ✅ NEW
  const navigate = useNavigate();

  const handleChange = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields ❌");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
      await axios.put("/auth/change-password", { password });

      alert("Password updated successfully");
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong ❌");
    }
  };

  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow ">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Change Password
            </h2>

            {/* 🔑 New Password */}
            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 🔑 Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* ❌ Error Message */}
            {error && (
              <p className="text-sm text-red-500 mb-3 text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleChange}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Update Password
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}