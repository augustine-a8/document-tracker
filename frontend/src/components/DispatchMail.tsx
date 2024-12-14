import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IDriver } from "../@types/mail";
import { addNewDriverApi, findDriverByNameApi } from "../api/courier.api";
import { IError } from "../@types/error";
import LoadingComponent from "./LoadingComponent";
import { ClipLoader } from "react-spinners";
import { TiUserDelete } from "react-icons/ti";

interface DispatchMailProps {
  isOpen: boolean;
  closeModal: () => void;
  mailsToDispatchCount: number;
  dispatchMail: (d: string) => void;
  apiLoading: boolean;
  apiError: IError | null;
}

export default function DispatchMail({
  isOpen,
  closeModal,
  mailsToDispatchCount,
  dispatchMail,
  apiLoading,
  apiError,
}: DispatchMailProps) {
  const [search, setSearch] = useState<string>("");
  const [drivers, setDrivers] = useState<IDriver[] | null>(null);
  const [driversLoading, setDriversLoading] = useState<boolean>(false);
  const [driversError, setDriversError] = useState<IError | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<IDriver | null>(null);
  const [openAddNewDriver, setOpenAddNewDriver] = useState<boolean>(false);
  const [addNewDriverApiLoading, setAddNewDriverApiLoading] =
    useState<boolean>(false);
  const [addNewDriverApiError, setAddNewDriverApiError] =
    useState<IError | null>(null);

  const handleSearchDriver = (search: string) => {
    setDriversLoading(true);
    findDriverByNameApi(search)
      .then((res) => {
        if (res.status === 200) {
          setDrivers(res.data.drivers);
          return;
        }
        setDriversError(res as IError);
      })
      .catch((err) => {
        setDriversError(err);
      })
      .finally(() => {
        setDriversLoading(false);
      });
  };

  const addNewDriver = (name: string, contact: string) => {
    setAddNewDriverApiLoading(true);
    addNewDriverApi(name, contact)
      .then((res) => {
        if (res.status === 200) {
          setSelectedDriver(res.data.driver);
          setOpenAddNewDriver(false);
          return;
        }
        setAddNewDriverApiError(res as IError);
      })
      .catch((err) => {
        setAddNewDriverApiError(err);
      })
      .finally(() => {
        setAddNewDriverApiLoading(false);
      });
  };

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
          <p>Dispatch Mail</p>
        </div>
        {apiError !== null ? (
          <div className="mb-2 text-center">
            <p className="text-red-500">{apiError.data.message}</p>
          </div>
        ) : undefined}
        <div className="px-4 flex flex-col gap-2 my-4">
          <div className="bg-gray-200 rounded-md py-2 text-center mb-2">
            <p>{mailsToDispatchCount} mails selected for dispatch</p>
          </div>
          {selectedDriver !== null ? (
            <div>
              <div className="bg-gray-200 rounded-md py-2 px-2 text-xs mb-2 flex flex-row ">
                <div className="flex-1">
                  <p className="text-xs capitalize font-medium underline">
                    Driver
                  </p>
                  <p>{selectedDriver.name}</p>
                  <p>{selectedDriver.contact}</p>
                </div>
                <div className=" grid place-items-center">
                  <button
                    onClick={() => {
                      setSelectedDriver(null);
                      setSearch("");
                      setDrivers(null);
                    }}
                  >
                    <div>
                      <TiUserDelete size={16} color="#d00000" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="grid place-items-center">
                <button
                  onClick={() => {
                    dispatchMail(selectedDriver.driverId);
                  }}
                >
                  <div className="h-8 rounded-md w-40 bg-blue-600 text-white grid place-items-center hover:opacity-80 duration-300">
                    {apiLoading ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <p>Dispatch</p>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : undefined}
          {openAddNewDriver ? (
            <AddNewDriver
              addNewDriver={addNewDriver}
              apiLoading={addNewDriverApiLoading}
              apiError={addNewDriverApiError}
            />
          ) : selectedDriver === null ? (
            <div>
              <div className="flex flex-row items-center justify-between border border-gray-400 rounded-md h-8 overflow-hidden">
                <div className="h-full flex flex-1 px-2">
                  <input
                    type="text"
                    className="flex flex-1 outline-none border-none"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && search !== "") {
                        handleSearchDriver(search);
                      }
                    }}
                    placeholder="Search for driver"
                  />
                </div>
                <button
                  className="h-full aspect-square"
                  onClick={() => {
                    if (search !== "") {
                      handleSearchDriver(search);
                    }
                  }}
                >
                  <div className="hover:bg-blue-700 hover:text-white hover:cursor-pointer h-full aspect-square grid place-items-center">
                    <CiSearch />
                  </div>
                </button>
              </div>
              <div className="max-h-[30vh] overflow-auto mt-2">
                {driversLoading ? (
                  <div className="grid place-items-center">
                    <LoadingComponent isLoading={true} size={16} />
                  </div>
                ) : driversError !== null ? (
                  <div>
                    <p>{driversError.data.message}</p>
                  </div>
                ) : drivers?.length === 0 ? (
                  <div className="grid place-items-center gap-2">
                    <p className="text-center">No drivers found</p>
                    <button
                      onClick={() => {
                        setOpenAddNewDriver(true);
                      }}
                    >
                      <div className="h-8 rounded-md w-40 bg-blue-600 text-white grid place-items-center hover:opacity-80 duration-300">
                        <p>Add new driver</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  drivers?.map((driver, idx) => (
                    <div
                      key={idx}
                      className="py-2 px-2 rounded-md hover:cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setSelectedDriver(driver);
                      }}
                    >
                      <p className="text-xs">{driver.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}

interface IAddNewDriverProps {
  addNewDriver: (n: string, c: string) => void;
  apiLoading: boolean;
  apiError: IError | null;
}

function AddNewDriver({
  addNewDriver,
  apiError,
  apiLoading,
}: IAddNewDriverProps) {
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");

  return (
    <div className="flex flex-col gap-2 my-2">
      {apiError !== null ? (
        <div>
          <p>{apiError.data.message}</p>
        </div>
      ) : undefined}
      <div className="form-control">
        <label htmlFor="name">Driver name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="form-control">
        <label htmlFor="contact">Driver contact</label>
        <input
          type="tel"
          id="contact"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
          }}
        />
      </div>
      <button
        onClick={() => {
          if (name !== "" || contact !== "") {
            addNewDriver(name, contact);
          }
        }}
      >
        <div className="h-8 rounded-md w-40 bg-blue-600 text-white grid place-items-center hover:opacity-80 duration-300">
          {apiLoading ? (
            <ClipLoader size={16} color="#fff" />
          ) : (
            <p>Add Driver</p>
          )}
        </div>
      </button>
    </div>
  );
}
