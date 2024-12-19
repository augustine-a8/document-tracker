import { useEffect, useRef, useState } from "react";
import { AddMail } from "./add-mail";
import AllMails from "../../../public/mails.json";
import { MailStatus, allMailStatuses } from "../../types";
import { useNavigate } from "react-router-dom";
import { DispatchMail } from "./dispatch-mail";

export function Mails() {
  const [openAddMailModal, setOpenAddMailModal] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openDispatchMail, setOpenDispatchMail] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<MailStatus>(
    MailStatus.PENDING
  );

  const [selectedMails, setSelectedMails] = useState<string[]>([]);

  const filterRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const toggleAddMailModal = () => {
    setOpenAddMailModal((prev) => !prev);
  };

  const toggleOpenFilter = () => {
    setOpenFilter((prev) => !prev);
  };

  const toggleDispatchMail = () => {
    setOpenDispatchMail((prev) => !prev);
  };

  const goToDetails = (id: string) => {
    navigate(`${id}`);
  };

  const onCheckAll = () => {
    if (selectedMails.length === AllMails.mails.length) {
      setSelectedMails([]);
    } else {
      setSelectedMails(AllMails.mails.map((mail) => mail.id));
    }
  };

  const onMailCheck = (mailId: string) => {
    if (selectedMails.includes(mailId)) {
      setSelectedMails((prev) => prev.filter((id) => id !== mailId));
    } else {
      setSelectedMails((prev) => [...prev, mailId]);
    }
  };

  const clearSelectedMails = () => {
    setSelectedMails([]);
  };

  const handleClickOutsideFilter = (e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      toggleOpenFilter();
    }
  };

  useEffect(() => {
    if (openFilter) {
      document.addEventListener("mousedown", handleClickOutsideFilter);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideFilter);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideFilter);
    };
  }, [openFilter]);

  return (
    <>
      <div className="relative">
        <div className="h-20 flex flex-row items-center justify-between border-b border-b-gray-200 bg-white z-50">
          <div>
            <h2 className="text-lg font-semibold">Courier</h2>
            <p className="text-gray-500 font-medium">All mails</p>
          </div>
          <button onClick={toggleAddMailModal}>
            <div className="flex flex-row items-center gap-2 border border-blue-500 rounded-md h-8 px-4 bg-blue-500 text-white hover:opacity-75 duration-500">
              <i className="ri-add-fill"></i>
              <p>Add mail</p>
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-4 my-6 relative">
          <div className="flex flex-row gap-4 items-center">
            <div className="border border-gray-200 rounded-md h-8 overflow-hidden px-1 flex flex-row items-center gap-2 w-[300px]">
              <i className="ri-search-2-line text-gray-400"></i>
              <input
                type="text"
                name=""
                id=""
                placeholder="Search for mail"
                className="flex-1 outline-none border-none"
              />
            </div>
            <div className="relative">
              <button onClick={toggleOpenFilter}>
                <div className="m-0 p-0 h-8 aspect-square grid place-items-center hover:border hover:border-gray-200 hover:cursor-pointer text-lg text-gray-400 hover:text-black rounded-md">
                  <i className="ri-filter-2-line"></i>
                </div>
              </button>
              {openFilter ? (
                <div
                  className="absolute flex flex-col gap-4 bg-white w-[300px] border border-gray-100 p-4 rounded-xl shadow-filter-box"
                  ref={filterRef}
                >
                  <div>
                    <label htmlFor="from-date" className="block mb-2">
                      From
                    </label>
                    <input
                      type="date"
                      id="from-date"
                      className="w-full border border-gray-200 rounded-md px-2"
                      value={fromDate}
                      onChange={(e) => {
                        setFromDate(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="to-date" className="block mb-2">
                      To
                    </label>
                    <input
                      type="date"
                      id="to-date"
                      className="w-full border border-gray-200 rounded-md px-2"
                      value={toDate}
                      onChange={(e) => {
                        setToDate(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2">Status</p>
                    <div className="flex flex-row items-center flex-wrap gap-2">
                      {allMailStatuses.map((status) => (
                        <button
                          onClick={() => {
                            setActiveStatus(status);
                          }}
                        >
                          <div
                            className={`text-xs px-4 py-1 border rounded-full hover:bg-gray-200 hover:font-medium ${
                              activeStatus === status
                                ? "bg-gray-200 font-medium"
                                : undefined
                            }`}
                          >
                            <p>{status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : undefined}
            </div>
          </div>
          <div className="w-full max-h-[calc(100vh-13.5rem)] overflow-y-scroll px-1">
            <table className="w-full mb-4">
              <thead>
                <tr className="flex flex-row items-center font-normal bg-gray-100 rounded-lg px-4 h-8">
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    <div className="flex flex-row items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedMails.length === AllMails.mails.length}
                        onChange={onCheckAll}
                      />
                      Reference number
                    </div>
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Organization
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Addressee(s)
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {AllMails.mails.map((mail) => (
                  <tr
                    key={mail.id}
                    className="flex flex-row items-center font-medium px-4 h-12 border-b border-b-gray-100 hover:cursor-pointer hover:shadow-table hover:rounded-md"
                    onClick={(e) => {
                      const tag = e.currentTarget.tagName;
                      if (tag === "INPUT") {
                        return;
                      }
                      goToDetails(mail.id);
                    }}
                  >
                    <td className="flex-[2_1_0] font-normal text-left">
                      <div className="flex flex-row items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedMails.includes(mail.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            onMailCheck(mail.id);
                          }}
                        />
                        {mail.referenceNumber}
                      </div>
                    </td>
                    <td className="flex-1 font-normal">{mail.organization}</td>
                    <td className="flex-[2_1_0] font-normal">
                      {mail.addressees.join(", ")}
                    </td>
                    <td className="flex-[2_1_0] font-normal">
                      {new Date(mail.date).toUTCString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="text-gray-500 text-xs font-medium">
              <p>Showing 1 - 25 of 312</p>
            </div>
            <div className="flex flex-row items-center gap-10">
              <div className="flex flex-row items-center gap-2">
                <button>
                  <div className="w-6 aspect-square rounded-md leading-none grid place-items-center text-gray-500 hover:border hover:text-black hover:cursor-pointer hover:font-medium">
                    <i className="ri-arrow-drop-left-line"></i>
                  </div>
                </button>
                {Array.from({ length: 5 }, (_, i) => i + 1).map((pageNum) => (
                  <button>
                    <div className="w-6 aspect-square rounded-md leading-none grid place-items-center text-gray-500 hover:border hover:text-black hover:cursor-pointer hover:font-medium">
                      <p>{pageNum}</p>
                    </div>
                  </button>
                ))}
                <button>
                  <div className="w-6 aspect-square rounded-md leading-none grid place-items-center text-gray-500 hover:border hover:text-black hover:cursor-pointer hover:font-medium">
                    <i className="ri-arrow-drop-right-line"></i>
                  </div>
                </button>
              </div>
              <div className="flex flex-row items-center gap-2">
                <label
                  className="text-gray-500 text-xs font-medium"
                  htmlFor="item-count"
                >
                  Items per page
                </label>
                <input
                  type="number"
                  id="item-count"
                  min={10}
                  max={20}
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value, 10));
                  }}
                  className="border border-200 rounded-md pl-1 h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMail isOpen={openAddMailModal} toggleModal={toggleAddMailModal} />
      {selectedMails.length > 0 ? (
        <div className="absolute bottom-1 left-44 bg-gray-200 z-[100] rounded-lg shadow-actionBar overflow-hidden p-1">
          <ActionBar
            selectedMails={selectedMails}
            toggleDispatchMails={toggleDispatchMail}
            clearSelectedMails={clearSelectedMails}
          />
        </div>
      ) : undefined}
      <DispatchMail
        isOpen={openDispatchMail}
        toggleModal={toggleDispatchMail}
        selectedMails={selectedMails}
      />
    </>
  );
}

interface IActionBarProps {
  selectedMails: string[];
  toggleDispatchMails: () => void;
  clearSelectedMails: () => void;
}

function ActionBar({
  selectedMails,
  toggleDispatchMails,
  clearSelectedMails,
}: IActionBarProps) {
  return (
    <div className="flex flex-row items-center justify-evenly h-8 w-[400px] rounded-md text-black">
      <div className="flex flex-row items-center gap-2">
        <i className="ri-checkbox-line"></i>
        <p className="text-xs">{selectedMails.length} selected</p>
      </div>
      <div className="w-[1px] bg-gray-400 h-full"></div>
      <div>
        <button onClick={toggleDispatchMails}>
          <div className="flex flex-row items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 hover:font-medium hover:text-green-600">
            <i className="ri-check-line"></i>
            <p className="text-xs">Dispatch</p>
          </div>
        </button>
      </div>
      <div className="w-[1px] bg-gray-400 h-full"></div>

      <div>
        <button onClick={clearSelectedMails}>
          <div className="flex flex-row items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 hover:font-medium hover:text-red-600">
            <i className="ri-close-line"></i>
            <p className="text-xs">Cancel</p>
          </div>
        </button>
      </div>
    </div>
  );
}
