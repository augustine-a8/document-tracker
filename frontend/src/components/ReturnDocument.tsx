import { useState, useRef } from "react";
import { MdOutlineClose } from "react-icons/md";
import { INotification } from "../@types/notification";
import { FaCheck, FaTimes } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import { returnDocumentApi } from "../api/document.api";
import { useNotification } from "../hooks/useNotification";
import LoadingComponent from "./LoadingComponent";
import { IError } from "../@types/error";

interface ReturnDocumentProps {
  toggleShowReturnModal: () => void;
  documentToReturn: INotification;
}

export default function ReturnDocument({
  toggleShowReturnModal,
  documentToReturn,
}: ReturnDocumentProps) {
  const [returnDocumentLoading, setReturnDocumentLoading] =
    useState<boolean>(false);
  const [returnDocumentStatus, setReturnDocumentStatus] = useState<number>();
  const [returnDocumentError, setReturnDocumentError] = useState<IError | null>(
    null
  );
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [showCustomOptionField, setShowCustomOptionField] =
    useState<boolean>(false);

  const textInputRef = useRef<HTMLInputElement>(null);

  const { token } = useAuth();
  const { removeNotifications } = useNotification();

  const returnDocument = () => {
    setReturnDocumentLoading(true);
    const documentId = documentToReturn.documentId;
    const historyId = documentToReturn.historyId;
    const notificationId = documentToReturn.notificationId;
    const comment =
      selectedReason === "" ? textInputRef.current?.value : selectedReason;
    if (!comment) {
      return;
    }
    returnDocumentApi(token, documentId, historyId, notificationId, comment)
      .then((res) => {
        if (res.status === 200) {
          removeNotifications([
            {
              historyId: documentToReturn.historyId,
              notificationId: documentToReturn.notificationId,
            },
          ]);
          setReturnDocumentStatus(200);
          toggleShowReturnModal();
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setReturnDocumentLoading(false);
      });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleShowReturnModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Return Document</h2>
          <div
            className="close-modal"
            role="button"
            onClick={toggleShowReturnModal}
          >
            <MdOutlineClose size={18} />
          </div>
        </div>
        <div className="w-full">
          <p className="mx-4 my-2 rounded-sm bg-[#e5e5e5] px-2 py-1 text-sm">
            Are you sure you want to return {documentToReturn.document.title} to{" "}
            {documentToReturn.sender.name}
          </p>
          <form action="" className="mx-4 text-sm flex flex-col gap-1">
            <p>Reason: </p>
            <div className="flex flex-row items-center gap-4">
              <input
                type="radio"
                name="reason"
                id="no-document"
                onChange={() => {
                  setSelectedReason("Document was never received");
                  setShowCustomOptionField(false);
                }}
              />
              <label htmlFor="no-document">Document was never received</label>
            </div>
            <div className="flex flex-row items-center gap-4">
              <input
                type="radio"
                name="reason"
                id="wrong-receiver"
                onChange={() => {
                  setSelectedReason("Not expecting document");
                  setShowCustomOptionField(false);
                }}
              />
              <label htmlFor="wrong-receiver">Not expecting document</label>
            </div>
            <div className="flex flex-row items-center gap-4">
              <input
                type="radio"
                name="reason"
                id="custom-option"
                onChange={() => {
                  setSelectedReason("");
                  setShowCustomOptionField(true);
                }}
              />
              <label htmlFor="custom-option">Custom reason</label>
            </div>
            {showCustomOptionField ? (
              <div className="flex flex-row items-center border border-[#d5d5d5] rounded-md p-1">
                <input
                  type="text"
                  name="reason"
                  placeholder="Type custom reason... "
                  className="flex flex-1 outline-none border-none"
                  ref={textInputRef}
                />
              </div>
            ) : undefined}
          </form>
        </div>
        {returnDocumentLoading ? (
          <div className="w-[100%] grid place-items-center border-t border-t-[#e5e5e5] py-2 px-4 mt-4 gap-2">
            <LoadingComponent isLoading={returnDocumentLoading} />
          </div>
        ) : (
          <div className="w-[100%] flex justify-end border-t border-t-[#e5e5e5] py-2 px-4 mt-4 gap-2">
            <button className="submit-btn" onClick={returnDocument}>
              <div className="flex flex-row items-center gap-2">
                <FaCheck />
                <p>Yes</p>
              </div>
            </button>
            <button
              className="submit-btn close"
              onClick={toggleShowReturnModal}
            >
              <div className="flex flex-row items-center gap-2">
                <FaTimes />
                <p>No</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
