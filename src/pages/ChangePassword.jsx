import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { HashLoader } from "react-spinners"; // ✅ loader
import toast from "react-hot-toast"; // ✅ ADD THIS

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setLoading(true);

      await axios.put("/auth/change-password", { password });

      toast.success("Password updated successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl transition-all">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
              🔒 Change Password
            </h2>

            {/* Password */}
            <input
              type="password"
              placeholder="New Password"
              disabled={loading}
              className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              disabled={loading}
              className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
            )}

            {/* Button */}
            <button
              onClick={handleChange}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <HashLoader size={20} color="#fff" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
