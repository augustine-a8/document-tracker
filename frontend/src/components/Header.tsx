import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { useAuth } from "../hooks/useAuth";
import { Config } from "../api/config";
import { useNotification } from "../hooks/useNotification";
import { getUserNotificationsApi } from "../api/notifications.api";
import { IError } from "../@types/error";
import Notifications from "./Notifications";
import Avatar from "./Avatar";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const {
    toggleNotificationModal,
    setAllNotifications,
    enqueueNotification,
    addNotification,
  } = useNotification();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      avatarDropdownRef.current &&
      !avatarDropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const connectToSocketServer = () => {
      const auth = {
        token,
      };

      const socket = io(Config.ServerEndpoint, { auth, withCredentials: true });

      socket.on("connect", () => {
        console.log("Connect to socket server with id: ", socket.id);
      });

      socket.on("connect_error", (error) => {
        console.log("Socket Connection Error: ", error.message);
      });

      // Add event queuing for the case when client receives multiple events from socket server

      socket.on("acknowledge_document", (data) => {
        console.log("Received acknowledge_document event from socket server");
        if (data) {
          enqueueNotification("acknowledge", data);
          addNotification(data);
          toggleNotificationModal();
        }
      });

      socket.on("return_document", (data) => {
        console.log("Received return_document event from socket server");
        if (data) {
          console.log({ data });
          enqueueNotification("return", data);
          addNotification(data);
          toggleNotificationModal();
        }
      });
    };

    connectToSocketServer();
  }, []);

  useEffect(() => {
    const fetchAllNotifications = () => {
      getUserNotificationsApi(token)
        .then((res) => {
          const notifications = res.data.notifications;
          setAllNotifications(notifications);
        })
        .catch((err) => {
          setError(err.data);
          console.log({ err });
        });
    };

    fetchAllNotifications();
  }, []);

  return (
    <>
      <header className="w-full h-14 relative px-4 border-b flex flex-row items-center justify-between bg-white">
        <nav className="flex flex-row items-center gap-4">
          <h1 className="logo">LOGO</h1>
          <div className="h-[100%]">
            <div className="flex flex-row gap-2 items-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border border-[#edf2fb] rounded-md text-sm text-[#023e8a] bg-[#edf2fb]"
                    : "px-2 py-1 text-sm rounded-md border border-transparent hover:border hover:border-gray-400 text-gray-600"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/documents"
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border border-[#edf2fb] rounded-md text-sm text-[#023e8a] bg-[#edf2fb]"
                    : "px-2 py-1 text-sm rounded-md border border-transparent hover:border hover:border-gray-400 text-gray-600"
                }
              >
                Documents
              </NavLink>
              <NavLink
                to="/pending-acknowledgements"
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border border-[#edf2fb] rounded-md text-sm text-[#023e8a] bg-[#edf2fb]"
                    : "px-2 py-1 text-sm rounded-md border border-transparent hover:border hover:border-gray-400 text-gray-600"
                }
              >
                Acknowledgements
              </NavLink>
            </div>
          </div>
        </nav>
        <div className="flex flex-row items-center gap-4 h-14">
          <Notifications
            showNotificationDropdown={showNotificationDropdown}
            toggleNotificationDropdown={toggleNotificationDropdown}
          />
          <Avatar
            avatarDropdownRef={avatarDropdownRef}
            showAvatarDropdown={showDropdown}
            toggleAvatarDropdown={toggleDropdown}
            handleLogout={handleLogout}
          />
        </div>
      </header>
    </>
  );
}
