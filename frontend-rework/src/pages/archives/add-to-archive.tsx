import { useState } from "react";
import { IModalBaseProps } from "../../types";

export function AddToArchive({ isOpen, toggleModal }: IModalBaseProps) {
  const [archivalNumber, setArchivalNumber] = useState<string>("");
  const [fileNumber, setFileNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [coveringDate, setCoveringDate] = useState<string>("");
  if (!isOpen) {
    return undefined;
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] grid place-items-center"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleModal();
        }
      }}
    >
      <div className="bg-white text-sm rounded-xl w-[30vw] px-6">
        <h2 className="text-base mt-4 mb-2 font-medium">Add new document</h2>
        <form action="" className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="archival-number"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Archival number
            </label>
            <input
              type="text"
              id="archival-number"
              value={archivalNumber}
              onChange={(e) => {
                setArchivalNumber(e.target.value);
              }}
              className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="file-number"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              File number
            </label>
            <input
              type="text"
              id="file-number"
              value={fileNumber}
              onChange={(e) => {
                setFileNumber(e.target.value);
              }}
              className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="covering-date"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Covering date
            </label>
            <input
              type="text"
              id="covering-date"
              value={coveringDate}
              onChange={(e) => {
                setCoveringDate(e.target.value);
              }}
              className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="w-full h-32 border border-gray-2s00 outline-none px-2 rounded-md"
            />
          </div>
        </form>
        <div className="flex flex-row items-center justify-end gap-6 my-4">
          <button onClick={toggleModal}>
            <div className="border border-blue-500 rounded-md h-8 w-28 grid place-items-center text-blue-500">
              <p>Cancel</p>
            </div>
          </button>
          <button>
            <div className="border border-blue-500 bg-blue-500 rounded-md h-8 w-28 px-4 grid place-items-center text-white">
              <p>Save</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
