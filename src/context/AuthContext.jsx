import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // ✅ LOGIN FUNCTION
  const login = (data) => {
    // Save token
    localStorage.setItem("token", data.token);

    // Remove sensitive data
    const safeUser = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    // Save user
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);

    // Redirect after login
    navigate("/"); // or "/dashboard"
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    // Force redirect
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
