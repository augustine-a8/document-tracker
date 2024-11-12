import { useEffect, useRef } from "react";
import { FaCircle, FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";

interface NotificationsProps {
  showNotificationDropdown: boolean;
  toggleNotificationDropdown: () => void;
}

export default function Notifications({
  showNotificationDropdown,
  toggleNotificationDropdown,
}: NotificationsProps) {
  const { allNotifications } = useNotification();
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  console.log({ allNotifications });

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
    // toggleNotificationModal();
  };

  return (
    <div className="relative h-[inherit]">
      <button
        onClick={toggleNotificationDropdown}
        className="text-gray-600 active:text-black h-[inherit] relative"
      >
        <FaRegBell size={20} />
        {allNotifications.length > 0 ? (
          <div className="absolute top-[calc(50%-16px)] left-[50%] w-4 h-4 bg-[#d00000] grid place-items-center rounded-full">
            <p className="text-[10px] text-white">{allNotifications.length}</p>
          </div>
        ) : undefined}
      </button>
      {showNotificationDropdown ? (
        <div
          className="absolute bg-white z-50 top-[80%] right-[10%] w-[300px] rounded-md dropdown-shadow flex flex-col max-h-[40vh] overflow-y-auto"
          ref={notificationDropdownRef}
        >
          {allNotifications.length > 0 ? (
            allNotifications.map((notification) => {
              return (
                <div
                  className="py-2 px-4 flex flex-row items-center gap-4 hover:cursor-pointer hover:bg-gray-100"
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
            <div className="px-4 py-2">
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </div>
      ) : undefined}
    </div>
  );
}
