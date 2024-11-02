import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaUser, FaRegBell } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside the dropdown
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      // Add event listener when the dropdown is open
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Clean up event listener when the dropdown closes
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
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
            <NavLink to="/history" className="nav-link">
              Custody History
            </NavLink>
          </div>
        </div>
      </nav>
      <div className="notifications">
        <FaRegBell size={22} />
        <div className="absolute top-[-25%] right-[-25%] w-4 h-4 bg-[#d00000] grid place-items-center rounded-full">
          <small className="text-xs text-white">6</small>
        </div>
      </div>
      <div className="avatar-container" role="button" onClick={toggleDropdown}>
        <div className="avatar"></div>
      </div>
      {showDropdown ? (
        <div className="dropdown" ref={dropdownRef}>
          <div>
            <div className="w-[18px]">
              <FaUser size={12} color="#808080" />
            </div>
            <p>My Profile</p>
          </div>
          <div role="button" onClick={handleLogout}>
            <div className="w-[18px]">
              <MdLogout color="#808080" />
            </div>
            <p>Logout</p>
          </div>
        </div>
      ) : undefined}
    </header>
  );
}
