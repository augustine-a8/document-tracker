import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  RiAccountCircleFill,
  RiCloseFill,
  RiDashboardFill,
  RiMenu4Line,
} from "react-icons/ri";

import { useAuth } from "../hooks/useAuth";
import { Config } from "../api/config";
import { useNotification } from "../hooks/useNotification";
import { getUserNotificationsApi } from "../api/notifications.api";
import { IError } from "../@types/error";
import Notifications from "./Notifications";
import Avatar from "./Avatar";
import { FaRegBell } from "react-icons/fa";
import { MdLogout, MdPendingActions } from "react-icons/md";
import { IoDocument, IoDocumentText } from "react-icons/io5";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const [error, setError] = useState<IError | null>(null);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    toggleNotificationModal,
    setAllNotifications,
    enqueueNotification,
    addNotification,
  } = useNotification();

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

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
      const socket = io(Config.ServerEndpoint, { withCredentials: true });

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
      getUserNotificationsApi()
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
      <header className="w-full h-14 relative px-4 border-b hidden flex-row items-center justify-between bg-white md:flex">
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
                to="/acknowledgements"
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
      <header className="w-[90%] mx-auto flex flex-row items-center h-14 md:hidden">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <RiMenu4Line className="text-gray-600" onClick={toggleMobileMenu} />
            <h1 className="logo">LOGO</h1>
          </div>
          <Notifications
            showNotificationDropdown={showNotificationDropdown}
            toggleNotificationDropdown={toggleNotificationDropdown}
          />
        </div>
        <div
          className={`fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[999] ease-in duration-[600] ${
            showMobileMenu ? "opacity-100 block" : "opacity-0 hidden"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              toggleMobileMenu();
            }
          }}
        >
          <div
            className={`bg-white w-[80%] h-full flex flex-col ease-in-out duration-300 ${
              showMobileMenu ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="h-14 flex flex-row items-center justify-between px-2">
              <h1 className="logo">LOGO</h1>
              <RiCloseFill
                className="text-gray-600"
                onClick={toggleMobileMenu}
              />
            </div>
            <nav className="flex flex-1 flex-col gap-4">
              <div className="flex flex-1 flex-col justify-end gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#023e8a] bg-[#edf2fb] px-2 py-2 text-sm"
                      : "px-2 py-2 text-sm text-gray-600 hover:text-[#023e8a] hover:bg-[#edf2fb]"
                  }
                  onClick={toggleMobileMenu}
                >
                  <div className="flex flex-row items-center gap-4">
                    <RiDashboardFill className="text-base" />
                    <p>Dashboard</p>
                  </div>
                </NavLink>
                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#023e8a] bg-[#edf2fb] px-2 py-2 text-sm"
                      : "px-2 py-2 text-sm text-gray-600 hover:text-[#023e8a] hover:bg-[#edf2fb]"
                  }
                  onClick={toggleMobileMenu}
                >
                  <div className="flex flex-row items-center gap-4">
                    <IoDocumentText className="text-base" />
                    <p>Documents</p>
                  </div>
                </NavLink>
                <NavLink
                  to="/acknowledgements"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#023e8a] bg-[#edf2fb] px-2 py-2 text-sm"
                      : "px-2 py-2 text-sm text-gray-600 hover:text-[#023e8a] hover:bg-[#edf2fb]"
                  }
                  onClick={toggleMobileMenu}
                >
                  <div className="flex flex-row items-center gap-4">
                    <MdPendingActions className="text-base" />
                    <p>Acknowledgements</p>
                  </div>
                </NavLink>
              </div>
              <div className="border-b"></div>
              <div className="flex flex-1 flex-col">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#023e8a] bg-[#edf2fb] px-2 py-2 text-sm"
                      : "px-2 py-2 text-sm text-gray-600 hover:text-[#023e8a] hover:bg-[#edf2fb]"
                  }
                  onClick={toggleMobileMenu}
                >
                  <div className="flex flex-row items-center gap-4">
                    <RiAccountCircleFill className="text-base" />
                    <p>Profile</p>
                  </div>
                </NavLink>
              </div>
            </nav>
            <button className="mb-4">
              <div className="flex flex-row gap-2 items-center justify-center text-sm text-white bg-[#d00000] mx-2 py-2 rounded-sm">
                <MdLogout className="text-base" />
                <p>Logout</p>
              </div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
