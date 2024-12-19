import { useState } from "react";
import { IModalBaseProps } from "../../types";

export function ForwardDocument({ isOpen, toggleModal }: IModalBaseProps) {
  const [forwardTo, setForwardTo] = useState<string>("");
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
        <h2 className="text-base mt-4 mb-2 font-medium">Forward document</h2>
        <form action="" className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="forward-to"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Forward to
            </label>
            <input
              type="text"
              id="forward-to"
              value={forwardTo}
              onChange={(e) => {
                setForwardTo(e.target.value);
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
            <textarea
              id="annotation"
              value={annotation}
              onChange={(e) => {
                setAnnotation(e.target.value);
              }}
              className="w-full h-24 border border-gray-200 outline-none px-2 pt-2 rounded-md"
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
              <p>Send</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
