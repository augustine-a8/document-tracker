import { useEffect, useRef } from "react";
import { FaCircle, FaRegBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import { IArchiveTransaction, ITransaction } from "../@types/transaction";

interface NotificationsProps {
  showNotificationDropdown: boolean;
  toggleNotificationDropdown: () => void;
}

export default function Notifications({
  showNotificationDropdown,
  toggleNotificationDropdown,
}: NotificationsProps) {
  const { notificationQueue } = useNotification();
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutsideNotificationDropdown = (event: MouseEvent) => {
    // Check if the click is outside the dropdown
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target as Node)
    ) {
      toggleNotificationDropdown();
    }
  };

  useEffect(() => {
    if (showNotificationDropdown) {
      // Add event listener when the dropdown is open
      document.addEventListener(
        "mousedown",
        handleClickOutsideNotificationDropdown
      );
    } else {
      // Clean up event listener when the dropdown closes
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNotificationDropdown
      );
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNotificationDropdown
      );
    };
  }, [showNotificationDropdown]);

  return (
    <div className="relative h-[inherit]">
      <button
        onClick={toggleNotificationDropdown}
        className="text-gray-600 active:text-black h-[inherit] relative"
      >
        <FaRegBell size={20} />
        {notificationQueue.length > 0 ? (
          <div className="absolute top-[calc(50%-16px)] left-[50%] w-4 h-4 bg-[#d00000] grid place-items-center rounded-full">
            <p className="text-[10px] text-white">{notificationQueue.length}</p>
          </div>
        ) : undefined}
      </button>
      {showNotificationDropdown ? (
        <div
          className="absolute bg-white z-50 top-[80%] right-[10%] w-[300px] rounded-md dropdown-shadow flex flex-col max-h-[40vh] overflow-y-auto"
          ref={notificationDropdownRef}
        >
          {notificationQueue.length > 0 ? (
            notificationQueue.map((notification) => {
              return (
                <Link
                  key={notification.notificationId}
                  className="py-2 px-4 flex flex-row items-center gap-4 hover:cursor-pointer hover:bg-gray-100"
                  to="/acknowledgements"
                >
                  {notification.notificationType === "acknowledge" ? (
                    <>
                      <FaCircle size={8} color="#007200" />
                      <p className="text-sm">
                        {(notification.transaction as ITransaction).sender.name}{" "}
                        sent{" "}
                        {
                          (notification.transaction as ITransaction).document
                            .title
                        }{" "}
                        at{" "}
                        {new Date(
                          (
                            notification.transaction as ITransaction
                          ).sentTimestamp
                        ).toUTCString()}
                      </p>
                    </>
                  ) : notification.notificationType === "return" ? (
                    <>
                      <FaCircle size={8} color="#007200" />
                      <p className="text-sm">
                        {(notification.transaction as ITransaction).sender.name}{" "}
                        returned{" "}
                        {
                          (notification.transaction as ITransaction).document
                            .title
                        }{" "}
                        at{" "}
                        {new Date(
                          (
                            notification.transaction as ITransaction
                          ).sentTimestamp
                        ).toUTCString()}
                      </p>
                    </>
                  ) : notification.notificationType ===
                    "archive_document_request" ? (
                    <>
                      <FaCircle size={8} color="#007200" />
                      <p className="text-sm">
                        {
                          (notification.transaction as IArchiveTransaction)
                            .requester.name
                        }{" "}
                        needs approval for{" "}
                        {
                          (notification.transaction as IArchiveTransaction)
                            .document.title
                        }{" "}
                        requested at{" "}
                        {new Date(
                          (
                            notification.transaction as IArchiveTransaction
                          ).requestedAt
                        ).toUTCString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <FaCircle size={8} color="#007200" />
                      <p className="text-sm">
                        {
                          (notification.transaction as IArchiveTransaction)
                            .requestApprover.name
                        }{" "}
                        {
                          (notification.transaction as IArchiveTransaction)
                            .status
                        }{" "}
                        request for{" "}
                        {
                          (notification.transaction as IArchiveTransaction)
                            .document.title
                        }{" "}
                        at{" "}
                        {new Date(
                          (
                            notification.transaction as IArchiveTransaction
                          ).requestApprovedAt!
                        ).toUTCString()}
                      </p>
                    </>
                  )}
                </Link>
              );
            })
          ) : (
            <div className="px-4 py-2">
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </div>
      ) : undefined}
    </div>
  );
}
