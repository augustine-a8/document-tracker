import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PropsWithChildren } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
