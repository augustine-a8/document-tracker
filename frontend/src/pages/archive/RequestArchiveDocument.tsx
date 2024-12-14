import { useState } from "react";

interface IModalProps {
  toggleModal: () => void;
  requestForDocument: (department: string) => void;
}

export default function RequestArchiveDocument({
  toggleModal,
  requestForDocument,
}: IModalProps) {
  const [department, setDepartment] = useState<string>("");

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Request for Archived Document</h2>
        </div>
        <div className="p-4 w-full text-sm">
          <div className="form-control">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="px-4 pb-4">
          <button
            className="bg-[#023e8a] text-white rounded-md h-8 px-8"
            onClick={() => {
              requestForDocument(department);
            }}
          >
            <p className="text-sm">Proceed</p>
          </button>
        </div>
      </div>
    </div>
  );
}
