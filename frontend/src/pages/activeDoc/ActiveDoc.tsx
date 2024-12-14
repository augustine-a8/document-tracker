import { NavLink, Outlet } from "react-router-dom";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";

export default function ActiveDocs() {
  return (
    <>
      <main>
        <ActiveDocHeader base="/activeDoc" />
        <Outlet />
      </main>
    </>
  );
}

function ActiveDocHeader({ base }: { base: string }) {
  return (
    <div className="flex flex-row gap-4 border-b px-4 text-sm text-gray-600 h-14">
      <NavLink
        to={`${base}/`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
        end
      >
        <div className="tab">
          <div className="tab-label">
            <FaRegFileAlt />
            <p>All Active Docs</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
      <NavLink
        to={`${base}/acknowledgements`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
        end
      >
        <div className="tab">
          <div className="tab-label">
            <MdOutlinePendingActions />
            <p>Acknowledgements</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
    </div>
  );
}
