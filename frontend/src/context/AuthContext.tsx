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
  const [me, setMe] = useState<IUser>();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setIsAuthenticated(auth.isAuthenticated);
    }
    setLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    const auth = {
      isAuthenticated: true,
    };
    localStorage.setItem("auth", JSON.stringify(auth));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  const setMyAccount = (myAccount: IUser) => {
    setMe(myAccount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, myAccount: me, setMyAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
