import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); // ✅ NEW
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
      setSent(true); // ✅ mark as sent
    } catch (err) {
      setMessage(
        err.response?.data?.msg || "Something went wrong ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-[420px]">

        <h2 className="text-2xl font-semibold mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-500 mb-6">
          Enter your email to receive a new password
        </p>

      <form onSubmit={handleSubmit}>
  <label className="block mb-1 text-sm font-medium">
    Email
  </label>

  <input
    type="email"
    placeholder="Enter your Email"
    value={email}
    disabled={sent}
    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    onChange={(e) => setEmail(e.target.value)}
  />

  {/* ✅ SHOW ONLY BEFORE SENT */}
  {!sent && (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg"
    >
      {loading ? "Sending..." : "Send New Password"}
    </button>
  )}
</form>

        {/* ✅ MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

        {/* ✅ NEW BUTTONS AFTER EMAIL SENT */}
        {sent && (
          <div className="mt-4 flex justify-between gap-2">

            {/* 🔁 RESEND */}
         <button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm"
>
  {loading ? "Sending..." : "🔁 Resend"}
</button>

            {/* 🔐 LOGIN */}
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