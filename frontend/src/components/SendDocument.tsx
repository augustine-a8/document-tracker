import { useState } from "react";
import { MdOutlineCancel, MdOutlineClose } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";
import { CiSearch } from "react-icons/ci";
import { IUser } from "../@types/user";
import { searchUserApi } from "../api/user.api";
import { IError } from "../@types/error";

interface ModalProps {
  toggleModal?: () => void;
  onSend: (receiverId: string, comment: string) => void;
}

export default function SendDocument({ toggleModal, onSend }: ModalProps) {
  const [search, setSearch] = useState<string>("");
  const [searchError, setSearchError] = useState<IError | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [chosenUser, setChosenUser] = useState<IUser | null>(null);
  const [comment, setComment] = useState<string>("");

  const { token } = useAuth();

  const handleSearchUser = () => {
    searchUserApi(token, search)
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data.searchResults);
        }
      })
      .catch((err) => {
        setSearchError(err);
      });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && toggleModal) {
          toggleModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <img src="/send.png" alt="new document icon" />
          </div>
          <h2>Send Document</h2>
          <div className="close-modal" role="button" onClick={toggleModal}>
            <MdOutlineClose size={18} />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchUser();
          }}
        >
          <div className="mx-4 pl-2 h-8 flex flex-row items-center search-user overflow-hidden">
            <input
              type="text"
              placeholder="Search user by name or email"
              className="flex flex-1"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button
              className="h-[inherit] w-8 grid place-items-center bg-[#023e8a]"
              type="submit"
            >
              <CiSearch color="white" />
            </button>
          </div>
        </form>
        {users.length > 0 ? (
          <div className="searched-users">
            {users.map((user, idx) => {
              const { name, email } = user;
              return (
                <div
                  key={idx}
                  className="searched-user"
                  onClick={() => {
                    setChosenUser(user);
                    setSearch("");
                    setUsers([]);
                  }}
                >
                  <p>{name}</p>
                  <p>{email}</p>
                </div>
              );
            })}
          </div>
        ) : undefined}
        {chosenUser ? (
          <div className="w-[100%] border-t border-t-[#e5e5e5] py-2 px-4 mt-4">
            <p className="text-xs font-semibold">Send to: </p>
            <div className="send-to-box mt-1 flex px-4 py-1">
              <div className="flex-1">
                <p>{chosenUser.name}</p>
                <p>{chosenUser.email}</p>
              </div>
              <div className="h-[inherit] grid place-items-center">
                <button className="clear-user">
                  <MdOutlineCancel
                    size={22}
                    color="#d90429"
                    role="button"
                    onClick={() => {
                      setChosenUser(null);
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        ) : undefined}
        <div className="mx-4 my-2 border">
          <textarea
            name=""
            id=""
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full outline-none border-0 pl-1"
            placeholder="Add a comment..."
          ></textarea>
        </div>
        <div className="w-[100%] border-t border-t-[#e5e5e5] py-2 px-4 mt-2 flex justify-end">
          <button
            className="submit-btn"
            disabled={chosenUser === null}
            aria-disabled={chosenUser === null}
            onClick={() => {
              if (chosenUser) {
                onSend(chosenUser.userId, comment);
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
