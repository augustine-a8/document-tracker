import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "remixicon/fonts/remixicon.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Documents as ActiveDocuments,
  DocumentDetails as ActiveDocumentDetails,
  Acknowledgements as ActiveDocumentAcknowledgements,
} from "./pages/activedocs";
import {
  Documents as ArchiveDocuments,
  ArchiveDetails,
  ArchiveRequests,
  ApprovedArchiveRequests,
} from "./pages/archives";
import { DriverDetails, Drivers, MailDetais, Mails } from "./pages/courier";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "active-docs",
        element: <ActiveDocuments />,
      },
      {
        path: "active-docs/:id",
        element: <ActiveDocumentDetails />,
      },
      {
        path: "active-docs/acknowledgements",
        element: <ActiveDocumentAcknowledgements />,
      },
      {
        path: "archives",
        element: <ArchiveDocuments />,
      },
      {
        path: "archives/:id",
        element: <ArchiveDetails />,
      },
      {
        path: "archives/requests",
        element: <ArchiveRequests />,
      },
      {
        path: "archives/approvals",
        element: <ApprovedArchiveRequests />,
      },
      {
        path: "courier",
        element: <Mails />,
      },
      {
        path: "courier/:id",
        element: <MailDetais />,
      },
      {
        path: "courier/drivers",
        element: <Drivers />,
      },
      {
        path: "courier/drivers/:id",
        element: <DriverDetails />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
