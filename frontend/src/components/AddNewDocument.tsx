import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

interface ModalProps {
  toggleModal?: () => void;
  addNewDocument: (
    serialNumber: string,
    title: string,
    description: string,
    type: string
  ) => void;
}

export default function AddNewDocument({
  toggleModal,
  addNewDocument,
}: ModalProps) {
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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
          <div>
            <img src="/new-document.png" alt="new document icon" />
          </div>
          <h2>Add New Document</h2>
          <div className="close-modal" role="button" onClick={toggleModal}>
            <MdOutlineClose size={18} />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewDocument(serialNumber, title, description, type);
          }}
        >
          <div className="form-control">
            <label htmlFor="serialNumber">Serial Number</label>
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => {
                setSerialNumber(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="w-[100%] flex justify-end border-t border-t-[#e5e5e5] py-2 px-4 mt-4">
            <button className="submit-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
