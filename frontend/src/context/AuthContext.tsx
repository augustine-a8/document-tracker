import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType } from "../@types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setToken(auth.token);
      setIsAuthenticated(auth.isAuthenticated);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    setIsAuthenticated(true);
    setToken(token);
    const auth = {
      isAuthenticated: true,
      token,
    };
    localStorage.setItem("auth", JSON.stringify(auth));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
