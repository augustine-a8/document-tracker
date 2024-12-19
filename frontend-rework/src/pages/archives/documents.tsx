import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Archives from "../../../public/archives.json";
import { AddToArchive } from "./add-to-archive";

export function Documents() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [openAddDocumentModal, setOpenAddDocumentModal] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const toggleAddDocumentModal = () => {
    setOpenAddDocumentModal((prev) => !prev);
  };

  const goToDetails = (id: string) => {
    navigate(`${id}`);
  };

  return (
    <>
      <div className="relative">
        <div className="h-20 flex flex-row items-center justify-between border-b border-b-gray-200 bg-white z-50">
          <div>
            <h2 className="text-lg font-semibold">Archives</h2>
            <p className="text-gray-500 font-medium">
              All documents in archives
            </p>
          </div>
          <button onClick={toggleAddDocumentModal}>
            <div className="flex flex-row items-center gap-2 border border-blue-500 rounded-md h-8 px-4 bg-blue-500 text-white hover:opacity-75 duration-500">
              <i className="ri-add-fill"></i>
              <p>Add to archive</p>
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-4 my-6">
          <div className="flex flex-row justify-between items-center">
            <div className="border border-gray-200 rounded-md h-8 overflow-hidden px-1 flex flex-row items-center gap-2 w-[300px]">
              <i className="ri-search-2-line text-gray-400"></i>
              <input
                type="text"
                name=""
                id=""
                placeholder="Search archives"
                className="flex-1 outline-none border-none"
              />
            </div>
          </div>
          <div className="w-full p-1">
            <table className="w-full mb-4">
              <thead>
                <tr className="flex flex-row items-center font-normal bg-gray-100 rounded-lg px-4 h-8">
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Item number
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Archival number
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Description
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Covering date
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {Archives.archives.map((document) => (
                  <tr
                    key={document.id}
                    className="flex flex-row items-center font-medium px-4 h-12 border-b border-b-gray-100 hover:cursor-pointer hover:shadow-table hover:rounded-md"
                    onClick={() => {
                      goToDetails(String(document.id));
                    }}
                  >
                    <td className="flex-1 font-normal">
                      {/* <div className="flex flex-row items-center gap-4">
                      <input type="checkbox" name="" id="" />
                    </div> */}
                      {document.itemNumber}
                    </td>
                    <td className="flex-1 font-normal">
                      {document.archivalNumber}
                    </td>
                    <td className="flex-[2_1_0] font-normal">
                      {document.description}
                    </td>
                    <td className="flex-1 font-normal">
                      {document.coveringDate}
                    </td>
                    <td className="flex-[2_1_0] font-normal">
                      {document.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mb-4 flex flex-row items-center justify-between">
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
      </div>
      <AddToArchive
        isOpen={openAddDocumentModal}
        toggleModal={toggleAddDocumentModal}
      />
    </>
  );
}
