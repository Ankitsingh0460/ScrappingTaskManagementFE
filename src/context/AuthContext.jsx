import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user safely from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Invalid user in localStorage");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN
  const login = async (credentials) => {
    try {
      const res = await axios.post("/auth/login", credentials);

      const safeUser = res.data.user;

      localStorage.setItem("user", JSON.stringify(safeUser));
      setUser(safeUser);

      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
   

    localStorage.clear();
    setUser(null);
     Navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
