import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  const logout = () => {
    setCurrentUser(null);
  };
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const UseAuth = () => {
  const context = useContext(AuthContext);
  const { currentUser, setCurrentUser, logout } = context;
  return { currentUser, setCurrentUser, logout };
};
