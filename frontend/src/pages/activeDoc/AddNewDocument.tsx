import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IError } from "../../@types/error";
import { ClipLoader } from "react-spinners";
import ErrorComponent from "../../components/ErrorComponent";

interface ModalProps {
  toggleModal?: () => void;
  addNewDocument: (subject: string, referenceNumber: string) => void;
  addNewDocumentLoading: boolean;
  addNewDocumentError: IError | null;
}

export default function AddNewDocument({
  toggleModal,
  addNewDocument,
  addNewDocumentLoading,
  addNewDocumentError,
}: ModalProps) {
  const [subject, setSubject] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && toggleModal) {
          toggleModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Document</h2>
          <div className="close-modal" role="button" onClick={toggleModal}>
            <MdOutlineClose size={18} />
          </div>
        </div>
        {addNewDocumentError !== null ? (
          <div className="mx-4 mt-2">
            <ErrorComponent error={addNewDocumentError} />
          </div>
        ) : undefined}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewDocument(subject, referenceNumber);
          }}
          className="flex flex-col gap-2 px-4 my-4"
        >
          <div className="form-control">
            <label htmlFor="serialNumber">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="title">Reference Number</label>
            <input
              type="text"
              id="title"
              value={referenceNumber}
              onChange={(e) => {
                setReferenceNumber(e.target.value);
              }}
            />
          </div>
        </form>
        {addNewDocumentLoading ? (
          <>
            <div className="w-[100%] grid place-items-center border-t border-t-[#e5e5e5] py-2 px-4 mt-4">
              <ClipLoader />
            </div>
          </>
        ) : (
          <div className="w-[100%] flex justify-end border-t border-t-[#e5e5e5] py-2 px-4 mt-4">
            <button
              className="submit-btn hover:opacity-80 duration-300"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                addNewDocument(subject, referenceNumber);
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
