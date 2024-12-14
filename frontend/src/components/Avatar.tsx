import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";

interface AvatarProps {
  avatarDropdownRef: React.RefObject<HTMLDivElement>;
  showAvatarDropdown: boolean;
  toggleAvatarDropdown: () => void;
  handleLogout: () => void;
}

export default function Avatar({
  avatarDropdownRef,
  showAvatarDropdown,
  toggleAvatarDropdown,
  handleLogout,
}: AvatarProps) {
  const { getMyAccount } = useAuth();
  const myAccount = getMyAccount();
  return (
    <div className="relative">
      <button onClick={toggleAvatarDropdown}>
        <div className="w-8 h-8 border border-gray-600 rounded-full grid place-items-center">
          <p className="text-sm">{myAccount?.name.slice(0, 2)}</p>
        </div>
      </button>
      {showAvatarDropdown ? (
        <div
          className="absolute z-50 w-[200px] right-[10%] top-[calc(100%+4px)] bg-white ease-in duration-300 dropdown-shadow rounded-md"
          ref={avatarDropdownRef}
        >
          <div
            className="flex flex-row items-center gap-2 px-2 py-2 hover:cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-black text-sm"
            onClick={() => {}}
          >
            <div className="w-[18px]">
              <FaUser size={12} />
            </div>
            <p>My Profile</p>
          </div>
          <div
            className="flex flex-row items-center gap-2 px-2 py-2 hover:cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-black text-sm"
            onClick={handleLogout}
          >
            <div className="w-[18px]">
              <MdLogout />
            </div>
            <p>Logout</p>
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
