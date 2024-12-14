import { NavLink, Outlet } from "react-router-dom";
import { RiMailLine } from "react-icons/ri";
import { GrDeliver } from "react-icons/gr";
import { LuMailbox } from "react-icons/lu";
import { MdDriveEta } from "react-icons/md";

export default function Courier() {
  return (
    <main>
      <CourierHeader base="/courier" />
      <Outlet />
    </main>
  );
}

function CourierHeader({ base }: { base: string }) {
  return (
    <div className="flex flex-row gap-4 border-b px-4 text-sm text-gray-600 h-14">
      <NavLink
        to={`${base}/`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
        end
      >
        <div className="tab">
          <div className="tab-label">
            <RiMailLine />
            <p>Pending</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
      <NavLink
        to={`${base}/transit`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
      >
        <div className="tab">
          <div className="tab-label">
            <GrDeliver />
            <p>Transit</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
      <NavLink
        to={`${base}/delivered`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
      >
        <div className="tab">
          <div className="tab-label">
            <LuMailbox />
            <p>Delivered</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
      <NavLink
        to={`${base}/drivers`}
        className={({ isActive }) => (isActive ? "active-link" : "link")}
      >
        <div className="tab">
          <div className="tab-label">
            <MdDriveEta />
            <p>Drivers</p>
          </div>
          <div className="tab-indicator"></div>
        </div>
      </NavLink>
    </div>
  );
}
