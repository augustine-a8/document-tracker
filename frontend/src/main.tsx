import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Document from "./pages/Document.tsx";
import DocumentWithHistory from "./pages/DocumentWithHistory.tsx";
import PendingAcknowledgements from "./pages/PendingAcknowledgements.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { NotificationModalProvider } from "./context/NotificationContext.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "documents",
        element: <Document />,
      },
      {
        path: "documents/:documentId",
        element: <DocumentWithHistory />,
      },
      {
        path: "acknowledgements",
        element: <PendingAcknowledgements />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationModalProvider>
        <RouterProvider router={router} />
      </NotificationModalProvider>
    </AuthProvider>
  </StrictMode>
);
