import { useState, useEffect } from "react";
import api from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("@EasyIce:user");
    if (!savedUser || savedUser === "undefined") return null;
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  const login = async (email, password) => {
    setLoadingAuth(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("@EasyIce:token", token);
        localStorage.setItem("@EasyIce:user", JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("@EasyIce:token");
    localStorage.removeItem("@EasyIce:user");
    setUser(null);
    window.location.reload();
  };

  return {
    signed: !!user,
    user,
    login,
    logout,
    loadingAuth,
  };
};
