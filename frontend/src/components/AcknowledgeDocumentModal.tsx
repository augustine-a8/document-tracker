import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNotificationModal } from "../hooks/useNotificationModal";
import { IError } from "../@types/error";
import { acknowledgeDocumentApi } from "../api/history.api";
import { useAuth } from "../hooks/useAuth";

export default function AcknowledgeDocumentModal() {
  const { notificationData, toggleNotificationModal, removeNotifications } =
    useNotificationModal();
  const [acknowledgementStatus, setAcknowledgementStatus] = useState<number>();
  const { token } = useAuth();

  const [error, setError] = useState<IError | null>(null);

  const acknowledgeDocument = () => {
    if (!notificationData) {
      throw new Error("No notification");
    }
    acknowledgeDocumentApi(
      token,
      notificationData.historyId,
      notificationData.notificationId
    )
      .then((res) => {
        console.log({ res });
        setAcknowledgementStatus(res.status);
        if (res.status === 200) {
          //TODO: remove from allNotifications
          removeNotifications([
            {
              historyId: notificationData.historyId,
              notificationId: notificationData.notificationId,
            },
          ]);
        }
      })
      .catch((err) => {
        console.log({ err });
        setError(err);
        setAcknowledgementStatus(err.status);
      });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleNotificationModal();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Acknowledge Document</h2>
          <div
            className="close-modal"
            role="button"
            onClick={toggleNotificationModal}
          >
            <MdOutlineClose size={18} />
          </div>
        </div>
        <div className="mx-4 mt-4 bg-[#e5e5e5] p-2 rounded-md">
          {acknowledgementStatus === 200 ? (
            <>
              <div>
                <img src="/success.png" alt="success image" />
                <p>Document acknowledged successfully</p>
              </div>
            </>
          ) : error ? (
            <>
              <div>
                <img src="/error.png" alt="success image" />
                <p>{error.data.message}</p>
              </div>
            </>
          ) : undefined}
          {acknowledgementStatus === undefined && notificationData ? (
            <p>
              <strong>{notificationData.sender.name}</strong> sent{" "}
              <strong>{notificationData.document.title}</strong> at{" "}
              <strong>
                {new Date(notificationData.history.sentTimestamp).toUTCString()}
              </strong>
            </p>
          ) : undefined}
        </div>
        <div className="w-[100%] flex justify-end border-t border-t-[#e5e5e5] py-2 px-4 mt-4 gap-2">
          {acknowledgementStatus !== 200 ? (
            <button className="submit-btn" onClick={acknowledgeDocument}>
              Confirm
            </button>
          ) : undefined}
          <button
            className="submit-btn close"
            onClick={toggleNotificationModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
