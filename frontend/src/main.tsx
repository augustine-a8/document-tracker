import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Document from "./pages/Document.tsx";
import DocumentWithTransaction from "./pages/DocumentWithTransaction.tsx";
import PendingAcknowledgements from "./pages/PendingAcknowledgements.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { NotificationModalProvider } from "./context/NotificationContext.tsx";
import Archives from "./pages/Archives.tsx";
import AllArchives from "./components/AllArchives.tsx";
import ArchiveRequest from "./components/ArchiveRequets.tsx";
import ArchiveDetails from "./components/ArchiveDetails.tsx";
import ArchivesPendingApproval from "./components/ArchivesPendingApproval.tsx";
import ArchivesPendingAcceptance from "./components/ArchivesPendingAcceptance.tsx";
import AllDocumentsTable from "./components/AllDocumentsTable.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

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
        children: [
          {
            index: true,
            element: <AllDocumentsTable />,
          },
          { path: "acknowledgements", element: <PendingAcknowledgements /> },
          {
            path: ":documentId",
            element: <DocumentWithTransaction />,
          },
        ],
      },
      {
        path: "archives",
        element: <Archives />,
        children: [
          { index: true, element: <AllArchives /> },
          {
            path: "pending-acceptance",
            element: <ArchivesPendingAcceptance />,
          },
          { path: "pending-approval", element: <ArchivesPendingApproval /> },
          { path: ":archiveId", element: <ArchiveDetails /> },
          { path: "requests", element: <ArchiveRequest /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <NotificationModalProvider>
          <RouterProvider router={router} />
        </NotificationModalProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
