import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import Notifications from "./Notifications";
import Avatar from "./Avatar";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, getMyAccount } = useAuth();

  const myAccount = getMyAccount();

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
                end
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/activeDoc/"
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border border-[#edf2fb] rounded-md text-sm text-[#023e8a] bg-[#edf2fb]"
                    : "px-2 py-1 text-sm rounded-md border border-transparent hover:border hover:border-gray-400 text-gray-600"
                }
              >
                Active Docs
              </NavLink>
              <NavLink
                to="/archives/"
                className={({ isActive }) =>
                  isActive
                    ? "px-2 py-1 border border-[#edf2fb] rounded-md text-sm text-[#023e8a] bg-[#edf2fb]"
                    : "px-2 py-1 text-sm rounded-md border border-transparent hover:border hover:border-gray-400 text-gray-600"
                }
              >
                Archives
              </NavLink>
              {myAccount?.role === "registrar" ? (
                <NavLink
                  to="/courier/"
                  className={({ isActive }) =>
                    isActive
                      ? "px-2 py-1 border border-[#edf2fb] rounded-md text-sm text-[#023e8a] bg-[#edf2fb]"
                      : "px-2 py-1 text-sm rounded-md border border-transparent hover:border hover:border-gray-400 text-gray-600"
                  }
                >
                  Courier
                </NavLink>
              ) : undefined}
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
