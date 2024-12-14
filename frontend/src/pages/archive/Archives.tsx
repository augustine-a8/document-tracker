import { useEffect } from "react";
import { RiArchive2Line, RiFileUploadLine } from "react-icons/ri";
import { NavLink, Outlet } from "react-router-dom";
import { MdPendingActions } from "react-icons/md";

import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { useNotification } from "../../hooks/useNotification";

export default function Archives() {
  const { enqueueNotification } = useNotification();
  const socket = useSocket();

  useEffect(() => {
    socket.on("archive_document_request", (data) => {
      console.log("Received archive_document_request event from socket server");
      if (data) {
        console.log({ data });
        enqueueNotification(data);
      }
    });

    return () => {
      socket.off("archive_document_request");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("request_approval", (data) => {
      console.log("Received request_approval event from socket server");
      if (data) {
        console.log({ data });
        enqueueNotification(data);
      }
    });

    return () => {
      socket.off("request_approval");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("request_fulfillment", (data) => {
      console.log("Received request_fulfillment event from socket server");
      if (data) {
        console.log({ data });
        enqueueNotification(data);
      }
    });

    return () => {
      socket.off("request_fulfillment");
    };
  }, [socket]);

  return (
    <main>
      <ArchiveHeader base="/archives" />
      <Outlet />
    </main>
  );
}

function ArchiveHeader({ base }: { base: string }) {
  const { getMyAccount } = useAuth();
  const myAccount = getMyAccount();
  return (
    <div className="flex flex-row gap-4 border-b px-4 text-sm text-gray-600 h-14">
      <NavLink
        to={`${base}/`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
        end
      >
        <div className="tab">
          <div className="tab-label">
            <RiArchive2Line />
            <p>All Archives</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
      {myAccount?.role !== "archiver" ? (
        <NavLink
          to={`${base}/requests`}
          className={({ isActive }) => (isActive ? "active-link" : "link")}
        >
          <div className="tab">
            <div className="tab-label">
              <RiFileUploadLine />
              <p>Requests</p>
            </div>
            <div className="tab-indicator"></div>
          </div>
        </NavLink>
      ) : undefined}
      {myAccount?.role === "director" ? (
        <>
          <NavLink
            to={`${base}/pending-approval`}
            className={({ isActive }) => (isActive ? "active-link" : "link")}
          >
            <div className="tab">
              <div className="tab-label">
                <MdPendingActions />
                <p>Pending Approval</p>
              </div>
              <div className="tab-indicator"></div>
            </div>
          </NavLink>
        </>
      ) : undefined}
      {myAccount?.role === "archiver" ? (
        <NavLink
          to={`${base}/pending-acceptance`}
          className={({ isActive }) => (isActive ? "active-link" : "link")}
        >
          <div className="tab">
            <div className="tab-label">
              <MdPendingActions />
              <p>Pending Requests</p>
            </div>
            <div className="tab-indicator"></div>
          </div>
        </NavLink>
      ) : undefined}
    </div>
  );
}
