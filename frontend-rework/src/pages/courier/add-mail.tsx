import { useState } from "react";
import { IModalBaseProps } from "../../types";

export function AddMail({ isOpen, toggleModal }: IModalBaseProps) {
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [addressees, setAddressees] = useState<string[]>([""]);

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
        <form
          action="#"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
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
              htmlFor="organization"
              className="block text-sm font-medium text-gray-500 mb-1"
            >
              Organization
            </label>
            <input
              type="text"
              id="organization"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
              }}
              className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="covering-date"
              className="flex flex-row items-center justify-between text-sm font-medium text-gray-500 mb-1 pr-2"
            >
              <p>Addressee(s)</p>
              <button
                onClick={() => {
                  setAddressees((prev) => [...prev, ""]);
                }}
              >
                <div className="hover:text-green-600 hover:font-medium">
                  <i className="ri-user-add-line"></i>
                </div>
              </button>
            </label>
            <div className="flex flex-col gap-2">
              {addressees.map((addressee, idx) => (
                <div className="w-full h-8 border border-gray-200 outline-none px-2 rounded-md flex flex-row">
                  <input
                    type="text"
                    id="covering-date"
                    value={addressee}
                    onChange={(e) => {
                      const newAddressees = [...addressees];
                      newAddressees[idx] = e.target.value;
                      setAddressees(newAddressees);
                    }}
                    className="flex-1 outline-none border-none"
                  />
                  {addressees.length > 1 ? (
                    <button
                      onClick={() => {
                        const newAddressees = addressees.filter(
                          (_, i) => i !== idx
                        );
                        setAddressees(newAddressees);
                      }}
                    >
                      <div className="hover:text-red-600 hover:font-medium text-gray-500">
                        <i className="ri-user-minus-line"></i>
                      </div>
                    </button>
                  ) : undefined}
                </div>
              ))}
            </div>
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
