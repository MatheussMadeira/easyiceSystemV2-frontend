import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Busca os dados salvos ao iniciar o App
    const loadStorageData = () => {
      const savedUser = localStorage.getItem("@EasyIce:user");
      const token = localStorage.getItem("@EasyIce:token");

      if (savedUser && token) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          // Configura o token nas requisições da API
          api.defaults.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Erro ao carregar storage", error);
          localStorage.clear();
        }
      }
      setLoadingAuth(false);
    };

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    try {
      delete api.defaults.headers.common["Authorization"];

      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("@EasyIce:token", token);
      localStorage.setItem("@EasyIce:user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("@EasyIce:token");
    localStorage.removeItem("@EasyIce:user");
    setUser(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        login,
        logout,
        loadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
