import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";

export function MailDetais() {
  const { id: mailId } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/courier");
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
            <h2 className="text-lg font-semibold">Mail Details</h2>
          </div>
          {/* <button>
            <div className="flex flex-row items-center gap-2 border border-blue-500 rounded-md h-8 px-4 bg-blue-500 text-white hover:opacity-75 duration-500">
              <i className="ri-file-add-line"></i>
              <p>Request</p>
            </div>
          </button> */}
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
                <p className="text-xs text-gray-500 mb-1">Reference number</p>
                <p>Reference number</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Organization</p>
                <p>Organization</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Addressee(s)</p>
                <p>Addressee(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Current status</p>
                <div className="flex flex-row items-center justify-center gap-4 w-32 py-1 rounded-full border border-gray-200 text-xs font-medium bg-gray-200 leading-none">
                  <i className="ri-circle-fill text-[6px]"></i>
                  <p>Status</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Driver</p>
                <p>Driver</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Driver contact</p>
                <p>Driver Contact</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Receiver</p>
                <p>Receiver</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Receiver contact</p>
                <p>Receiver Contact</p>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 mx-4">
              <h3 className="text-base font-medium">Mail Logs</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="px-4 py-2 border border-gray-200 rounded-lg flex flex-row items-center justify-between">
            <div>
              <div className="flex flex-row items-center gap-4">
                <i className="ri-circle-line text-[10px]"></i>
                <p>Status</p>
              </div>
            </div>
            <div className="text-gray-500">
              <p>Date</p>
              <p>Time</p>
            </div>
          </div>
          <div className="px-4 py-2 border border-gray-200 rounded-lg flex flex-row items-center justify-between">
            <div>
              <div className="flex flex-row items-center gap-4">
                <i className="ri-circle-line text-[10px]"></i>
                <p>Status</p>
              </div>
            </div>
            <div className="text-gray-500">
              <p>Date</p>
              <p>Time</p>
            </div>
          </div>
          <div className="px-4 py-2 border border-gray-200 rounded-lg flex flex-row items-center justify-between">
            <div>
              <div className="flex flex-row items-center gap-4">
                <i className="ri-circle-line text-[10px]"></i>
                <p>Status</p>
              </div>
            </div>
            <div className="text-gray-500">
              <p>Date</p>
              <p>Time</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
