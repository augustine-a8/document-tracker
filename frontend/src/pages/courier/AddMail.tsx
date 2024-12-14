import { useState } from "react";
import { MdAddCircleOutline, MdOutlineRemoveCircle } from "react-icons/md";

interface IAddMailProps {
  isOpen: boolean;
  closeModal: () => void;
  handleAddMail: (referenceNumber: string, addressee: string) => void;
}

export default function AddMail({
  isOpen,
  closeModal,
  handleAddMail,
}: IAddMailProps) {
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [addressees, setAddressees] = useState<string[]>([""]);

  const handleInputChange = (index: number, value: string) => {
    const newAddressees = [...addressees];
    newAddressees[index] = value;
    setAddressees(newAddressees);
  };

  const addAddressee = () => {
    setAddressees((prev) => [...prev, ""]);
  };

  const removeAddressee = (index: number) => {
    const newAddressees = addressees.filter((_, i) => i !== index);
    setAddressees(newAddressees);
  };

  if (!isOpen) {
    return;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          closeModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <p>Add new mail</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addressees.forEach((addressee) => {
              handleAddMail(referenceNumber, addressee);
              setReferenceNumber("");
              setAddressees([""]);
            });
          }}
          action="#"
          className="flex flex-col gap-2 px-4 my-4"
        >
          <div className="form-control">
            <label htmlFor="ref-number">Reference number</label>
            <input
              type="text"
              name=""
              id="ref-number"
              value={referenceNumber}
              onChange={(e) => {
                setReferenceNumber(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <div className="flex flex-row items-center justify-between mb-2">
              <label htmlFor="addressees">Addressee(s)</label>
              <button className="mr-2" type="button" onClick={addAddressee}>
                <MdAddCircleOutline color="#023e8a" size={16} />
              </button>
            </div>
            {addressees.map((addressee, idx) => (
              <div
                key={idx}
                className="flex flex-row items-center border border-[rgb(128,128,128)] rounded-md mb-2"
              >
                <input
                  type="text"
                  value={addressee}
                  onChange={(e) => {
                    handleInputChange(idx, e.target.value);
                  }}
                  className="flex flex-1 border-none outline-none"
                />
                {addressees.length > 1 ? (
                  <button
                    type="button"
                    className="mr-2"
                    onClick={() => {
                      removeAddressee(idx);
                    }}
                  >
                    <MdOutlineRemoveCircle color="#d00000" />
                  </button>
                ) : undefined}
              </div>
            ))}
          </div>
        </form>
        <div className="px-4 py-2 flex flex-row items-center gap-4 justify-end border-t">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              addressees.forEach((addressee) => {
                handleAddMail(referenceNumber, addressee);
                setReferenceNumber("");
                setAddressees([""]);
              });
            }}
          >
            <div className="h-8 px-8 border border-[#023e8a] bg-[#023e8a] rounded-md grid place-items-center hover:opacity-80 duration-300">
              <p className="text-white">Submit</p>
            </div>
          </button>
          <button
            onClick={() => {
              closeModal();
            }}
          >
            <div className="h-8 px-8 border border-[#d00000] bg-[#d00000] rounded-md grid place-items-center hover:opacity-80 duration-300">
              <p className="text-white">Close</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
