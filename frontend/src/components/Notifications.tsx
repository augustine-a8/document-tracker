import { useEffect, useRef } from "react";
import { FaCircle, FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotificationModal } from "../hooks/useNotificationModal";

interface NotificationsProps {
  showNotificationDropdown: boolean;
  toggleNotificationDropdown: () => void;
}

export default function Notifications({
  showNotificationDropdown,
  toggleNotificationDropdown,
}: NotificationsProps) {
  const { toggleNotificationModal, allNotifications } = useNotificationModal();
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

  const goToPendingAcknowledgements = () => {
    navigate("/pending-acknowledgements");
    toggleNotificationModal();
  };

  return (
    <div className="notifications">
      <FaRegBell size={22} role="button" onClick={toggleNotificationDropdown} />
      {showNotificationDropdown ? (
        <div className="notifications-dropdown" ref={notificationDropdownRef}>
          {allNotifications.length > 0 ? (
            allNotifications.map((notification) => {
              return (
                <div
                  className="px-4 py-2 flex flex-row items-center gap-4 notification"
                  role="link"
                  onClick={goToPendingAcknowledgements}
                >
                  <FaCircle size={8} color="#007200" />
                  <p className="text-sm">
                    {notification.sender.name} sent{" "}
                    {notification.document.title} at{" "}
                    {new Date(notification.history.sentTimestamp).toUTCString()}
                  </p>
                </div>
              );
            })
          ) : (
            <>
              <div className="px-4 py-2 flex flex-row items-center gap-4 hover:cursor-auto hover:bg-white">
                <p className="text-sm">No new notifications</p>
              </div>
            </>
          )}
        </div>
      ) : undefined}
      {allNotifications.length > 0 ? (
        <div className="absolute top-[-25%] right-[-25%] w-4 h-4 bg-[#d00000] grid place-items-center rounded-full">
          <small className="text-xs text-white">
            {allNotifications.length}
          </small>
        </div>
      ) : undefined}
    </div>
  );
}
