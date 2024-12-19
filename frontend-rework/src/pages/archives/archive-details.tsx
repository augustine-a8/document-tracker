import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";

export function ArchiveDetails() {
  const { id: archiveId } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/active-docs");
  };

  return (
    <>
      <div>
        <div className="h-20 flex flex-row gap-4 items-center justify-between bg-white z-50">
          <div className="flex flex-row gap-4 items-center">
            <button onClick={goBack}>
              <div>
                <i className="ri-arrow-left-line text-gray-500 text-xl hover:text-black hover:cursor-pointer"></i>
              </div>
            </button>
            <h2 className="text-lg font-semibold">Archive Document Details</h2>
          </div>
          <button>
            <div className="flex flex-row items-center gap-2 border border-blue-500 rounded-md h-8 px-4 bg-blue-500 text-white hover:opacity-75 duration-500">
              <i className="ri-file-add-line"></i>
              <p>Request</p>
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="px-4 py-6 border border-gray-200 rounded-3xl">
            <div className="mb-2 flex flex-row justify-end">
              <button>
                <div className="text-gray-500 hover:text-black hover:font-medium text-xs border border-gray-200 hover:border-black h-7 w-20 flex flex-row items-center justify-center rounded-full">
                  <p>Edit</p>
                  <i className="ri-edit-2-line"></i>
                </div>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 font-medium">
              <div>
                <p className="text-xs text-gray-500 mb-1">Item number</p>
                <p>Item number</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Archival number</p>
                <p>Archival number</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">File number</p>
                <p>File number</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Covering Date</p>
                <p>Covering Date</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Itaque consequuntur pariatur repellat ab, saepe dolorem!
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Remarks</p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
            </div>
          </div>
          {/* <div className="px-4 py-6 pb-0 border border-gray-200 rounded-3xl">
            <div className="mb-2">
              <h3 className="text-base font-medium">Transaction History</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="flex flex-row items-center font-normal bg-gray-100 rounded-lg px-4 h-8">
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Sender
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Recipient
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Action
                  </th>
                  <th className="flex-1 font-normal text-gray-600 text-left">
                    Date
                  </th>
                  <th className="flex-[2_1_0] font-normal text-gray-600 text-left">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {ActiveDocumentTransactions.transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="flex flex-row items-center font-medium px-4 h-12 border-b border-b-gray-200"
                  >
                    <td className="flex-1 font-normal">{transaction.sender}</td>
                    <td className="flex-1 font-normal">
                      {transaction.receiver}
                    </td>
                    <td className="flex-1 font-normal">{transaction.action}</td>
                    <td className="flex-1 font-normal">
                      {new Date(transaction.date).toDateString()}
                    </td>
                    <td className="flex-[2_1_0] font-normal">
                      {transaction.comments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
        <div className="mb-4"></div>
      </div>
      {/* <ForwardDocument
        isOpen={openForwardDocumentModal}
        toggleModal={toggleForwardDocumentModal}
      /> */}
    </>
  );
}
