import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter email ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/forgot-password", { email });

      setMessage(res.data.msg || "New password sent to your email ✅");
      setSent(true);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-yellow-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px] border">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to LogIn
          </button>
        </div>
        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-1 text-center">
          <span className="text-blue-500">Blu</span>
          <span className="text-yellow-500">Desk</span>
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Forgot your password? No worries 👌
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-1 text-sm font-medium">Email</label>

          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            disabled={sent}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          {!sent && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 hover:opacity-90 text-white p-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send New Password"}
            </button>
          )}
        </form>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}

        {/* ACTION BUTTONS */}
        {sent && (
          <div className="mt-5 flex gap-2">
            {/* RESEND */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
            >
              {loading ? "Sending..." : "🔁 Resend"}
            </button>

            {/* LOGIN */}
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
            >
              🔐 Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
