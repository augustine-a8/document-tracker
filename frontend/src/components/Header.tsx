import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { useAuth } from "../hooks/useAuth";
import { Config } from "../api/config";
import { useNotificationModal } from "../hooks/useNotificationModal";
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
  const { setNotificationData, toggleNotificationModal, setAllNotifications } =
    useNotificationModal();

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

      socket.on("acknowledge_document", (data) => {
        console.log("Received event from socket server");
        if (data) {
          console.log({ data });
          setNotificationData(data);
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
    <header className="relative">
      <nav>
        <h1 className="logo">LOGO</h1>
        <div className="h-[100%]">
          <div className="h-[inherit]">
            <NavLink to="/" className="nav-link">
              Dashboard
            </NavLink>
            <NavLink to="/documents" className="nav-link">
              Documents
            </NavLink>
            <NavLink to="/pending-acknowledgements" className="nav-link">
              Pending Acknowledgements
            </NavLink>
          </div>
        </div>
      </nav>
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
    </header>
  );
}
