import { useState } from "react";
import { IModalBaseProps } from "../../types";

export function AddDocument({ isOpen, toggleModal }: IModalBaseProps) {
  const [subject, setSubject] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [annotation, setAnnotation] = useState<string>("");
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
              htmlFor="reference-number"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Reference number
            </label>
            <input
              type="text"
              id="reference-number"
              value={referenceNumber}
              onChange={(e) => {
                setReferenceNumber(e.target.value);
              }}
              className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="annotation"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Annotation
            </label>
            <input
              type="text"
              id="annotation"
              value={annotation}
              onChange={(e) => {
                setAnnotation(e.target.value);
              }}
              className="w-full h-8 border border-gray-2s00 outline-none px-2 rounded-md"
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
