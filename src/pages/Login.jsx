import { useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await login({ email, password }); // ✅ single call

      if (data.forcePasswordChange) {
        navigate("/change-password");
        return;
      }

      if (data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/my-tasks");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-yellow-100">
      {/* CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px] border">
        {/* LOGO / TITLE */}
        <h2 className="text-2xl font-semibold mb-1 text-center">
          <span className="text-blue-500">Blu</span>
          <span className="text-yellow-500">Desk</span>
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Welcome back ! Please login to continue.
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <label className="block mb-1 text-sm font-medium">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👈 toggle
              placeholder="Enter your password"
              className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁️ Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* FORGOT */}
          <Link to="/forgot-password">
            <p className="text-blue-600 text-sm mb-6 cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </Link>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:opacity-90 text-white p-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
