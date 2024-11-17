import { CiSearch } from "react-icons/ci";
import { RiArchive2Line, RiFileUploadLine } from "react-icons/ri";
import { NavLink, Outlet } from "react-router-dom";
import { MdPendingActions } from "react-icons/md";
// import { useEffect, useState } from "react";
// import { getMyAccountApi } from "../api/user.api";
// import { IUser } from "../@types/user";
import { useAuth } from "../hooks/useAuth";

export default function Archives() {
  // const [myAccount, setMyAccount] = useState<IUser>();

  // useEffect(() => {
  //   const getMyAccount = () => {
  //     getMyAccountApi().then((res) => {
  //       if (res.status === 200) {
  //         setMyAccount(res.data.myAccount);
  //       }
  //     });
  //   };

  //   getMyAccount();
  // }, []);

  const { myAccount } = useAuth();

  return (
    <main>
      <div className="flex flex-row w-full items-center justify-between px-4 py-2 border-b">
        {myAccount.role === "archiver" ? (
          <div>
            <button className="border border-[#023e8a] px-4 h-8 rounded-md text-[#023e8a] hover:bg-[#023e8a] hover:text-white">
              <p className="text-sm">Add to archive</p>
            </button>
          </div>
        ) : undefined}
        {myAccount.role !== "archiver" ? <div></div> : undefined}
        <div className="border border-[#ddd] rounded-md px-2 h-8 flex flex-row items-center">
          <input
            type="text"
            placeholder="Search archives..."
            className="w-full border-none outline-none"
          />
          <CiSearch />
        </div>
      </div>
      <div className="flex flex-row gap-4 border-b px-4 text-sm text-gray-600 h-14">
        <NavLink
          to=""
          className={({ isActive }) => (isActive ? "active-link" : "link")}
          end
        >
          <div className="tab">
            <div className="tab-label">
              <RiArchive2Line />
              <p>All Archives</p>
            </div>
            <div className="tab-indicator"></div>
          </div>
        </NavLink>
        {myAccount?.role !== "archiver" ? (
          <NavLink
            to="requests"
            className={({ isActive }) => (isActive ? "active-link" : "link")}
            end
          >
            <div className="tab">
              <div className="tab-label">
                <RiFileUploadLine />
                <p>Requests</p>
              </div>
              <div className="tab-indicator"></div>
            </div>
          </NavLink>
        ) : undefined}
        {myAccount?.role === "HOD" ? (
          <>
            <NavLink
              to="pending-approval"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
              end
            >
              <div className="tab">
                <div className="tab-label">
                  <MdPendingActions />
                  <p>Pending Approval</p>
                </div>
                <div className="tab-indicator"></div>
              </div>
            </NavLink>
          </>
        ) : undefined}
        {myAccount?.role === "archiver" ? (
          <NavLink
            to="pending-acceptance"
            className={({ isActive }) => (isActive ? "active-link" : "link")}
            end
          >
            <div className="tab">
              <div className="tab-label">
                <MdPendingActions />
                <p>Incoming Requests</p>
              </div>
              <div className="tab-indicator"></div>
            </div>
          </NavLink>
        ) : undefined}
      </div>
      <Outlet />
    </main>
  );
}
