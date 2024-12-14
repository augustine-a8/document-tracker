import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthContextType } from "../@types/auth";
import { IUser } from "../@types/user";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setIsAuthenticated(auth.isAuthenticated);
    }
    setLoading(false);
  }, []);

  const login = (user: IUser) => {
    setIsAuthenticated(true);
    const auth = {
      isAuthenticated: true,
      user,
    };
    localStorage.setItem("auth", JSON.stringify(auth));
  };

  const getMyAccount = () => {
    const auth = localStorage.getItem("auth");
    if (auth === null) {
      console.log("Not auth item in local storage");
      return;
    }
    const user: IUser = JSON.parse(auth).user;
    return user;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, getMyAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
