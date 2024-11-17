import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";

import { useSocket } from "../hooks/useSocket";
import { useNotification } from "../hooks/useNotification";

export default function Document() {
  const socket = useSocket();
  const { enqueueNotification } = useNotification();

  useEffect(() => {
    socket.on("acknowledge_document", (data) => {
      console.log("Received acknowledge_document event from socket server");
      if (data) {
        console.log({ data });
        enqueueNotification(data);
      }
    });

    return () => {
      socket.off("acknowledge_document");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("return_document", (data) => {
      console.log("Received return_documet event from socket server");
      if (data) {
        console.log({ data });
        enqueueNotification(data);
      }
    });

    return () => {
      socket.off("return_document");
    };
  }, [socket]);

  return (
    <>
      <main>
        <div className="flex flex-row gap-4 border-b px-4 text-sm text-gray-600 h-14">
          <NavLink
            to=""
            className={({ isActive }) => (isActive ? "active-link" : "link")}
            end
          >
            <div className="tab">
              <div className="tab-label">
                <FaRegFileAlt />
                <p>All Documents</p>
              </div>
              <div className="tab-indicator"></div>
            </div>
          </NavLink>
          <NavLink
            to="/documents/acknowledgements"
            className={({ isActive }) => (isActive ? "active-link" : "link")}
            end
          >
            <div className="tab">
              <div className="tab-label">
                <MdOutlinePendingActions />
                <p>Acknowledgements</p>
              </div>
              <div className="tab-indicator"></div>
            </div>
          </NavLink>
        </div>
        <Outlet />
      </main>
    </>
  );
}
