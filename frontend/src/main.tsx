import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ActiveDoc from "./pages/activeDoc/ActiveDoc.tsx";
import PendingAcknowledgements from "./pages/activeDoc/PendingAcknowledgements.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { NotificationModalProvider } from "./context/NotificationContext.tsx";
import Archives from "./pages/archive/Archives.tsx";
import AllArchives from "./pages/archive/AllArchives.tsx";
import ArchiveRequest from "./pages/archive/ArchiveRequests.tsx";
import ArchiveDetails from "./pages/archive/ArchiveDetails.tsx";
import ArchivesPendingApproval from "./pages/archive/ArchivesPendingApproval.tsx";
import ArchivesPendingAcceptance from "./pages/archive/ArchivesPendingAcceptance.tsx";
import AllActiveDocs from "./pages/activeDoc/AllActiveDocs.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import Courier from "./pages/courier/Courier.tsx";
import AllMails from "./pages/courier/AllMails.tsx";
import Transit from "./pages/courier/Transit.tsx";
import Delivered from "./pages/courier/Delivered.tsx";
import MailDetails from "./components/MailDetails.tsx";
import ActiveDocDetails from "./pages/activeDoc/ActiveDocDetails.tsx";
import Drivers from "./pages/courier/Drivers.tsx";
import DriverDetails from "./pages/courier/DriverDetails.tsx";

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
        path: "activeDoc",
        element: <ActiveDoc />,
        children: [
          {
            path: "",
            element: <AllActiveDocs />,
          },
          { path: "acknowledgements", element: <PendingAcknowledgements /> },
          {
            path: ":activeDocId",
            element: <ActiveDocDetails />,
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
      {
        path: "courier",
        element: <Courier />,
        children: [
          {
            index: true,
            element: <AllMails />,
          },
          {
            path: ":mailId",
            element: <MailDetails />,
          },
          {
            path: "transit",
            element: <Transit />,
          },
          {
            path: "delivered",
            element: <Delivered />,
          },
          {
            path: "drivers",
            element: <Drivers />,
          },
          {
            path: "drivers/:driverId",
            element: <DriverDetails />,
          },
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
