import { useState } from "react";
import { IModalBaseProps } from "../../types";
import Drivers from "../../../public/drivers.json";

interface IDispatchMailProps extends IModalBaseProps {
  selectedMails: string[];
}

export function DispatchMail({
  isOpen,
  toggleModal,
  selectedMails,
}: IDispatchMailProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [showDrivers, setShowDrivers] = useState<boolean>(false);

  const toggleShowDrivers = () => {
    setShowDrivers((prev) => !prev);
  };

  if (!isOpen) {
    return undefined;
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] grid place-items-center z-[200]"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleModal();
        }
      }}
    >
      <div className="bg-white text-sm rounded-xl w-[30vw] px-6">
        <h2 className="text-base mt-4 mb-2 font-medium">Dispatch mails</h2>
        <div>
          <p className="text-center font-medium mb-2">
            Assign {selectedMails.length} mails to driver
          </p>
        </div>
        {/* <div>
          <div className="flex flex-row items-center justify-between px-4 h-8 rounded-md bg-gray-100 mb-2">
            <p>{selectedDriver}Meatpie</p>
            <i className="ri-user-unfollow-line"></i>
          </div>
        </div> */}
        <div className="relative">
          <div
            className="h-8 rounded-md border px-4 flex flex-row items-center justify-between"
            role="button"
            onClick={toggleShowDrivers}
          >
            <p>{selectedDriver ? selectedDriver : "Select driver"}</p>
            <i
              className={`ri-arrow-drop-${showDrivers ? "up" : "down"}-line`}
            ></i>
          </div>
          {showDrivers ? (
            <div className="absolute bg-white left-0 right-0 shadow-filter-box rounded-md p-2 h-[30vh] overflow-y-scroll">
              {Drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="h-8 px-4 w-full rounded-md hover:cursor-pointer hover:bg-gray-200 hover:font-medium grid items-center"
                  role="button"
                  onClick={() => {
                    setSelectedDriver(driver.name);
                    toggleShowDrivers();
                  }}
                >
                  <p>{driver.name}</p>
                </div>
              ))}
            </div>
          ) : undefined}
        </div>

        <div className="flex flex-row items-center justify-end gap-6 my-4">
          <button onClick={toggleModal}>
            <div className="border border-blue-500 rounded-md h-8 w-28 grid place-items-center text-blue-500">
              <p>Cancel</p>
            </div>
          </button>
          <button>
            <div className="border border-blue-500 bg-blue-500 rounded-md h-8 w-28 px-4 grid place-items-center text-white">
              <p>Dispatch</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
