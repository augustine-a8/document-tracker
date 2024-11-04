import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

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
  return (
    <>
      <div
        className="avatar-container"
        role="button"
        onClick={toggleAvatarDropdown}
      >
        <div className="avatar"></div>
      </div>
      {showAvatarDropdown ? (
        <div className="dropdown" ref={avatarDropdownRef}>
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
    </>
  );
}
