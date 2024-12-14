import { useRef } from "react";
import { ClipLoader } from "react-spinners";
import { IError } from "../../@types/error";
import { INewArchive } from "../../@types/archive";

interface IAddToArchiveProps {
  isOpen: boolean;
  toggleModal: () => void;
  addToArchive: (newArchive: INewArchive) => void;
  apiLoading: boolean;
  apiError: IError | null;
}

export default function AddToArchive({
  isOpen,
  toggleModal,
  addToArchive,
  apiLoading,
  apiError,
}: IAddToArchiveProps) {
  const itemNumberRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const remarksRef = useRef<HTMLInputElement | null>(null);
  const coveringDateRef = useRef<HTMLInputElement | null>(null);
  const fileNumberRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) {
    return;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <p>Add To Archive</p>
        </div>
        {apiError !== null ? (
          <div className="border-b text-red-500">
            <p className="text-sm">{apiError.data.message}</p>
          </div>
        ) : undefined}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newArchive = {
              itemNumber: itemNumberRef.current?.value,
              description: descriptionRef.current?.value,
              remarks: remarksRef.current?.value,
              coveringDate: coveringDateRef.current?.value,
              fileNumber: fileNumberRef.current?.value,
            };
            addToArchive(newArchive);
          }}
          className="flex flex-col gap-2 px-4 my-4"
        >
          <div className="form-control">
            <label htmlFor="item-number">Item number</label>
            <input type="text" id="item-number" ref={itemNumberRef} />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" ref={descriptionRef} />
          </div>
          <div className="form-control">
            <label htmlFor="remarks">Remarks</label>
            <input type="text" id="remarks" ref={remarksRef} />
          </div>
          <div className="form-control">
            <label htmlFor="covering-date">Covering date</label>
            <input type="text" id="covering-date" ref={coveringDateRef} />
          </div>
          <div className="form-control">
            <label htmlFor="location">File number</label>
            <input type="text" id="location" ref={fileNumberRef} />
          </div>
        </form>
        {apiLoading ? (
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
                const newArchive = {
                  itemNumber: itemNumberRef.current?.value,
                  description: descriptionRef.current?.value,
                  remarks: remarksRef.current?.value,
                  coveringDate: coveringDateRef.current?.value,
                  fileNumber: fileNumberRef.current?.value,
                };
                addToArchive(newArchive);
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
