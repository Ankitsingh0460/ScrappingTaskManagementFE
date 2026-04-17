import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    localStorage.setItem("token", data.token);

    // ✅ Remove password before storing
    const safeUser = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};