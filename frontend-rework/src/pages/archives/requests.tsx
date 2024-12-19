import { useState } from "react";
import Requests from "../../../public/archive_requests.json";

export function ArchiveRequests() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const onAcknowledgementCheck = (ackId: string) => {
    if (selectedRequests.includes(ackId)) {
      setSelectedRequests((prev) => prev.filter((id) => id !== ackId));
    } else {
      setSelectedRequests((prev) => [...prev, ackId]);
    }
  };

  const onAcknowledgeAll = () => {
    if (selectedRequests.length === Requests.archiveRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(
        Requests.archiveRequests.map((request) => String(request.id))
      );
    }
  };

  return (
    <>
      <div className="relative">
        <div className="h-20 flex flex-row items-center justify-between border-b border-b-gray-200 bg-white z-50">
          <div>
            <h2 className="text-lg font-semibold">Archive Requests</h2>
            <p className="text-gray-500 font-medium">
              Requests for documents from archives
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center mt-4">
            <div className="border border-gray-200 rounded-md h-8 overflow-hidden px-1 flex flex-row items-center gap-2 w-[300px]">
              <i className="ri-search-2-line text-gray-400"></i>
              <input
                type="text"
                name=""
                id=""
                placeholder="Search for document"
                className="flex-1 outline-none border-none"
              />
            </div>
          </div>
          <div className="w-full max-h-[calc(100vh-13.5rem)] overflow-y-scroll">
            <table className="w-full mb-4">
              <thead>
                <tr className="flex flex-row items-center font-normal bg-gray-100 rounded-lg px-4 h-8">
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    <div className="flex flex-row items-center gap-4">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        onChange={onAcknowledgeAll}
                      />
                      Archival number
                    </div>
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Description
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Covering date
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Requested by
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Requested at
                  </th>
                </tr>
              </thead>
              <tbody>
                {Requests.archiveRequests.map((request) => (
                  <tr className="flex flex-row items-center font-medium px-4 h-12 border-b border-b-gray-200">
                    <td className="flex-[2_1_0] font-normal text-left">
                      <div className="flex flex-row items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedRequests.includes(
                            String(request.id)
                          )}
                          onChange={() => {
                            onAcknowledgementCheck(String(request.id));
                          }}
                        />
                        {request.archiveNumber}
                      </div>
                    </td>
                    <td className="flex-[2_1_0] font-normal text-left">
                      {request.description}
                    </td>
                    <td className="flex-1 font-normal text-left">
                      {request.coveringDate}
                    </td>
                    {/* <td className="flex-1 font-normal text-left">
                    {acknowledgement.recipient}
                  </td> */}
                    {/* <td className="flex-1 font-normal text-left">
                    {acknowledgement.action}
                  </td> */}
                    <td className="flex-1 font-normal text-left">
                      {request.requestedBy}
                    </td>
                    <td className="flex-[2_1_0] font-normal text-left">
                      {new Date(request.requestedAt).toDateString()}
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
      {selectedRequests.length > 0 ? (
        <div className="absolute bottom-1 left-44 bg-gray-200 z-[100] rounded-lg shadow-actionBar overflow-hidden p-1">
          <ActionBar selectedRequests={selectedRequests} />
        </div>
      ) : undefined}
    </>
  );
}

interface IActionBarProps {
  selectedRequests: string[];
}

function ActionBar({ selectedRequests }: IActionBarProps) {
  return (
    <div className="flex flex-row items-center justify-evenly h-8 w-[400px] rounded-md text-black">
      <div className="flex flex-row items-center gap-2">
        <i className="ri-checkbox-line"></i>
        <p className="text-xs">{selectedRequests.length} selected</p>
      </div>
      <div className="w-[1px] bg-gray-400 h-full"></div>
      <div>
        <button>
          <div className="flex flex-row items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 hover:font-medium hover:text-green-600">
            <i className="ri-check-line"></i>
            <p className="text-xs">Approve</p>
          </div>
        </button>
      </div>
      <div className="w-[1px] bg-gray-400 h-full"></div>

      <div>
        <button>
          <div className="flex flex-row items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 hover:font-medium hover:text-red-600">
            <i className="ri-close-line"></i>
            <p className="text-xs">Reject</p>
          </div>
        </button>
      </div>
    </div>
  );
}
