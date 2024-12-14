import { useState } from "react";

interface IDriverProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function AddDriver({ isOpen, closeModal }: IDriverProps) {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");

  if (!isOpen) {
    return;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <p>Add Driver</p>
        </div>
        <div className="pt-4">
          <form action="#" className="px-4 flex flex-col gap-4">
            <div className="form-control">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                value={name}
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                value={contact}
                id="contact"
                onChange={(e) => {
                  setContact(e.target.value);
                }}
              />
            </div>
          </form>
          <div className="border-t my-4 px-4 pt-4 flex flex-row items-center justify-end">
            <button>
              <div className="bg-green-600 text-white w-32 h-8 grid place-items-center rounded-md">
                <p>Submit</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
