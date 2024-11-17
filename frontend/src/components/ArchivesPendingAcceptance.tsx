import { useEffect, useRef, useState } from "react";
import { MdCheck } from "react-icons/md";
import { PiDotOutlineFill, PiDotsThreeOutlineFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { getApprovedRequestsPendingAcceptanceApi } from "../api/archive.api";
import { IArchiveTransaction } from "../@types/archive";

export default function ArchivesPendingAcceptance() {
  const [requestsPendingAcceptance, setRequestsPendingAcceptance] = useState<
    IArchiveTransaction[]
  >([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchRequestsPendingAcceptance = () => {
      getApprovedRequestsPendingAcceptanceApi().then((res) => {
        if (res.status === 200) {
          setRequestsPendingAcceptance(res.data.requestsPendingAcceptance);
        }
      });
    };
    fetchRequestsPendingAcceptance();
  }, []);

  const openActionsModal = (idx: number) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === idx ? null : idx));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdownIndex !== null &&
        dropdownRefs.current[openDropdownIndex] &&
        !dropdownRefs.current[openDropdownIndex].contains(event.target as Node)
      ) {
        setOpenDropdownIndex(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);
  return (
    <div className="my-4 px-4">
      <div className="w-full rounded-[12px] overflow-x-hidden border">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Document</th>
              <th>Requester</th>
              <th>Requested At</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestsPendingAcceptance.map((request, idx) => {
              const {
                archiveDocument,
                requester,
                requestedAt,
                comment,
                status,
              } = request;
              return (
                <tr className="relative">
                  <td data-cell="#">{idx + 1}</td>
                  <td data-cell="title">{archiveDocument.title}</td>
                  <td data-cell="requester">{requester.name}</td>
                  <td data-cell="requested at">
                    {new Date(requestedAt).toUTCString()}
                  </td>
                  <td data-cell="comment">{comment}</td>
                  <td data-cell="status">
                    <div
                      className={`rounded-full h-6 w-fit pl-2 pr-4 flex flex-row items-center gap-1 justify-center ${
                        status === "submitted"
                          ? " text-yellow-500 bg-yellow-100"
                          : status === "approved"
                          ? "reen-400 text-green-400 bg-green-100"
                          : status === "rejected"
                          ? " text-red-500 bg-red-100"
                          : " text-blue-500 bg-blue-100"
                      }`}
                    >
                      <PiDotOutlineFill className="text-xl" />
                      <p className="text-xs capitalize">{status}</p>
                    </div>
                  </td>
                  <td data-cell="actions" className="relative">
                    <button
                      onClick={() => {
                        openActionsModal(idx);
                      }}
                    >
                      <PiDotsThreeOutlineFill />
                    </button>
                    {openDropdownIndex === idx ? (
                      <div
                        ref={(el) => (dropdownRefs.current[idx] = el)}
                        className="absolute right-[75%] top-[60%] bg-white border flex flex-col gap-1 z-[900] p-2 rounded-md shadow-[rgba(0,_0,_0,_0.16)_0px_3px_6px,_rgba(0,_0,_0,_0.23)_0px_3px_6px;]"
                      >
                        <button className="h-6 px-2 bg-green-600 text-white rounded-md">
                          <div className="flex flex-row items-center gap-2">
                            <MdCheck />
                            <p>Accept</p>
                          </div>
                        </button>
                        <button className="h-6 px-2 bg-red-600 text-white rounded-md">
                          <div className="flex flex-row items-center gap-2">
                            <RxCross2 />
                            <p>Reject</p>
                          </div>
                        </button>
                      </div>
                    ) : undefined}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
