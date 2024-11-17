import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { getAllDepartmentHeadsApi } from "../api/user.api";
import { IUser } from "../@types/user";

interface IModalProps {
  toggleModal: () => void;
  requestForDocument: (rId: string, comment: string) => void;
}

export default function RequestArchiveDocument({
  toggleModal,
  requestForDocument,
}: IModalProps) {
  const [openDepartmentHeadDropdown, setOpenDepartmentHeadDropdown] =
    useState<boolean>(false);
  const [allDepartmentHeads, setAllDepartmentHeads] = useState<IUser[]>([]);
  const [departmentHeads, setDepartmentHeads] = useState<IUser[]>([]);
  const [searchDepartmentHead, setSearchDepartmentHead] = useState<string>("");
  const [selectedDepartmentHead, setSelectedDepartmentHead] = useState<IUser>();
  const [error, setError] = useState<boolean>(false);

  const commentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchAllDepartmentHeads = () => {
      getAllDepartmentHeadsApi().then((res) => {
        if (res.status === 200) {
          setAllDepartmentHeads(res.data.departmentHeads);
          setDepartmentHeads(res.data.departmentHeads);
        }
      });
    };
    fetchAllDepartmentHeads();
  }, []);

  const toggleDepartmentHeadDropdown = () => {
    setOpenDepartmentHeadDropdown((prev) => !prev);
  };

  const findDepartmentHead = (str: string) => {
    setDepartmentHeads(
      allDepartmentHeads.filter(
        (dh) =>
          dh.name.toLowerCase().includes(str.toLowerCase()) ||
          dh.email.toLowerCase().includes(str.toLowerCase())
      )
    );
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Request for Archived Document</h2>
        </div>
        <div className="p-4 w-full">
          <div>
            <p className="text-sm text-gray-500">Department head</p>
            <div
              onClick={toggleDepartmentHeadDropdown}
              className={`w-full border ${
                error && selectedDepartmentHead === undefined
                  ? "border-[#d00000]"
                  : "border-[#c5c5c5]"
              } px-2 h-8 rounded-md flex flex-row items-center text-gray-700 hover:cursor-pointer hover:border-2 mb-2`}
            >
              <p className="flex-1">
                {selectedDepartmentHead === undefined
                  ? "Select department head"
                  : selectedDepartmentHead.name}
              </p>
              <div>
                <div className="h-8 w-8 grid place-items-center">
                  {openDepartmentHeadDropdown ? (
                    <RiArrowDropUpLine />
                  ) : (
                    <RiArrowDropDownLine />
                  )}
                </div>
              </div>
            </div>
            {openDepartmentHeadDropdown ? (
              <div className="border border-[#c5c5c5] rounded-md mb-2">
                <div className="w-full flex flex-row items-center gap-2 px-2 h-8 border-b border-b-[#c5c5c5]">
                  <input
                    type="text"
                    className="flex-1 outline-none border-none"
                    placeholder="Search department head"
                    value={searchDepartmentHead}
                    onChange={(e) => {
                      setSearchDepartmentHead(e.target.value);
                      findDepartmentHead(e.target.value);
                    }}
                  />
                  <div>
                    <CiSearch />
                  </div>
                </div>
                <div className="flex flex-col max-h-[7.5rem] overflow-y-auto">
                  {departmentHeads.map((departmentHead, idx) => {
                    const { email, name } = departmentHead;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedDepartmentHead(departmentHead);
                          toggleDepartmentHeadDropdown();
                        }}
                        className="text-sm px-2 py-1 flex flex-col justify-center hover:cursor-pointer hover:bg-[#e5e5e5]"
                      >
                        <p>{name}</p>
                        <p className="text-xs text-gray-600">{email}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : undefined}
          </div>
          <div>
            <p className="text-sm text-gray-500">Comment</p>
            <textarea
              name="comment"
              id="comment"
              className={`w-full border rounded-md outline-none px-2 ${
                error && commentRef.current?.value === ""
                  ? "border-[#d00000]"
                  : "border-[#c5c5c5]"
              }`}
              ref={commentRef}
            ></textarea>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button
            className="bg-[#023e8a] text-white rounded-md h-8 px-8"
            onClick={() => {
              setError(false);
              if (
                selectedDepartmentHead === undefined ||
                commentRef.current?.value === ""
              ) {
                console.log("Unfilled");
                setError(true);
                return;
              }
              requestForDocument(
                selectedDepartmentHead.userId,
                commentRef.current?.value ? commentRef.current.value : ""
              );
              toggleModal();
            }}
          >
            <p className="text-sm">Proceed</p>
          </button>
        </div>
      </div>
    </div>
  );
}
