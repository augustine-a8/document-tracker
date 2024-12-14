import { useEffect, useRef } from "react";
import { FaRegBell } from "react-icons/fa";
import { useNotification } from "../hooks/useNotification";

interface NotificationsProps {
  showNotificationDropdown: boolean;
  toggleNotificationDropdown: () => void;
}

export default function Notifications({
  showNotificationDropdown,
  toggleNotificationDropdown,
}: NotificationsProps) {
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutsideNotificationDropdown = (event: MouseEvent) => {
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target as Node)
    ) {
      toggleNotificationDropdown();
    }
  };

  const { activeDocNotifications, archiveNotifications, total } =
    useNotification();

  useEffect(() => {
    if (showNotificationDropdown) {
      document.addEventListener(
        "mousedown",
        handleClickOutsideNotificationDropdown
      );
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNotificationDropdown
      );
    }

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
        {total > 0 ? (
          <div className="absolute top-[calc(50%-16px)] left-[50%] w-4 h-4 bg-[#d00000] grid place-items-center rounded-full">
            <p className="text-[10px] text-white">{total}</p>
          </div>
        ) : undefined}
      </button>
      {showNotificationDropdown ? (
        <div
          className="absolute bg-white z-50 top-[80%] right-[10%] w-[300px] rounded-md dropdown-shadow flex flex-col max-h-[40vh] overflow-y-auto p-2"
          ref={notificationDropdownRef}
        >
          {total === 0 ? (
            <div className="px-4 py-2">
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <>
              {activeDocNotifications.map((n) => (
                <div className="p-2 hover:bg-gray-200 hover:cursor-pointer text-xs rounded-md">
                  <p>{n.message}</p>
                </div>
              ))}
              {archiveNotifications.map((n) => (
                <div className="p-2 hover:bg-gray-200 hover:cursor-pointer text-xs rounded-md">
                  <p>{n.message}</p>
                </div>
              ))}
            </>
          )}
        </div>
      ) : undefined}
    </div>
  );
}
