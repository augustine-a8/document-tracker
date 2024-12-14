import { NavLink } from "react-router-dom";
import { useState } from "react";

import { Logo } from "./logo";

export function Sidebar() {
  const [activeDocsMenuOpen, setActiveDocsMenuOpen] = useState<boolean>(false);
  const [archiveMenuOpen, setArchiveMenuOpen] = useState<boolean>(false);
  const [courierMenuOpen, setCourierMenuOpen] = useState<boolean>(false);

  const toggleActiveDocsMenu = () => {
    setActiveDocsMenuOpen((prev) => !prev);
  };

  const toggleArchiveMenu = () => {
    setArchiveMenuOpen((prev) => !prev);
  };

  const toggleCourierMenu = () => {
    setCourierMenuOpen((prev) => !prev);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[300px] border-r text-sm flex flex-col">
      <div className="w-[90%] mx-auto flex flex-row items-center justify-between my-4">
        <button>
          <Logo />
        </button>
        <button>
          <div className="text-xl text-gray-400 hover:text-black hover:cursor-pointer">
            <i className="ri-sidebar-fold-fill"></i>
          </div>
        </button>
      </div>
      <nav className="w-[90%] mx-auto flex-1">
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink
              to="/"
              className="flex flex-row gap-4 items-center hover:font-medium"
            >
              <i className="ri-dashboard-horizontal-line"></i>
              <p>Dashboard</p>
            </NavLink>
          </li>
          <li>
            <div>
              <button
                className="flex flex-row gap-4 items-center w-full hover:font-medium"
                onClick={toggleActiveDocsMenu}
              >
                <i className="ri-article-line"></i>
                <p className="flex-1 text-left">Active Doc</p>
                <i
                  className={`ri-arrow-${
                    activeDocsMenuOpen ? "up" : "down"
                  }-s-line`}
                ></i>
              </button>
              {activeDocsMenuOpen ? (
                <div className="flex flex-row gap-4 ml-2">
                  <div className="border-l border-gray-200"></div>
                  <ul className="flex flex-col py-2 flex-1">
                    <li className="w-full">
                      <NavLink
                        to="/"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Documents</p>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/acknowledgements"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Acknowledgements</p>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              ) : undefined}
            </div>
          </li>
          <li>
            <div>
              <button
                onClick={toggleArchiveMenu}
                className="flex flex-row gap-4 items-center w-full hover:font-medium"
              >
                <i className="ri-archive-line"></i>
                <p className="flex-1 text-left">Archive</p>
                <i
                  className={`ri-arrow-${
                    archiveMenuOpen ? "up" : "down"
                  }-s-line`}
                ></i>
              </button>
              {archiveMenuOpen ? (
                <div className="flex flex-row gap-4 ml-2">
                  <div className="border-l border-gray-200"></div>
                  <ul className="flex flex-col py-2 flex-1">
                    <li className="w-full">
                      <NavLink
                        to="/"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Documents</p>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/requests"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Requests</p>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/approvals"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Approvals</p>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              ) : undefined}
            </div>
          </li>
          <li>
            <div>
              <button
                onClick={toggleCourierMenu}
                className="flex flex-row gap-4 items-center w-full hover:font-medium"
              >
                <i className="ri-mail-send-line"></i>
                <p className="flex-1 text-left">Courier</p>
                <i
                  className={`ri-arrow-${
                    courierMenuOpen ? "up" : "down"
                  }-s-line`}
                ></i>
              </button>
              {courierMenuOpen ? (
                <div className="flex flex-row gap-4 ml-2">
                  <div className="border-l border-gray-200"></div>
                  <ul className="flex flex-col py-2 flex-1">
                    <li className="w-full">
                      <NavLink
                        to="/"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Mails</p>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/drivers"
                        className="block border border-transparent rounded-lg w-full py-1 px-4 text-gray-600 hover:bg-gray-100 hover:border-gray-100 hover:text-black"
                      >
                        <p>Drivers</p>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              ) : undefined}
            </div>
          </li>
          <li>
            <NavLink
              to="/"
              className="flex flex-row gap-4 items-center hover:font-medium"
            >
              <i className="ri-user-line"></i>
              <p>Profile</p>
            </NavLink>
          </li>
        </ul>
      </nav>
      <ul className="w-[90%] mx-auto my-4 flex flex-col gap-4">
        <li>
          <NavLink
            to="/"
            className="flex flex-row gap-4 items-center hover:font-medium"
          >
            <div className="relative">
              <div>
                <i className="ri-notification-2-line"></i>
              </div>
              <div className="absolute -top-[15%] -right-[15%] p-0 m-0 rounded-full bg-red-600 w-3 h-3 grid place-items-center">
                <p className="m-0 p-0 text-[8px] text-white leading-none">6</p>
              </div>
            </div>
            <p>Notification</p>
          </NavLink>
        </li>
        <li>
          <button className="flex flex-row gap-4 items-center text-red-700 font-semibold">
            <i className="ri-logout-circle-line"></i>
            <p>Logout</p>
          </button>
        </li>
      </ul>
    </aside>
  );
}
