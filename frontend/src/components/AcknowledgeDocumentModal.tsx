import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNotification } from "../hooks/useNotification";
import { IError } from "../@types/error";
import { acknowledgeDocumentApi } from "../api/history.api";
import { useAuth } from "../hooks/useAuth";
import { INotificationQueue } from "../@types/notification";

export default function AcknowledgeDocumentModal() {
  const { toggleNotificationModal, removeNotifications, dequeueNotification } =
    useNotification();
  const [acknowledgementStatus, setAcknowledgementStatus] = useState<number>();
  const [currentNotification, setCurrentNotification] =
    useState<INotificationQueue | null>(null);
  const { token } = useAuth();

  const [error, setError] = useState<IError | null>(null);

  const acknowledgeDocument = () => {
    if (currentNotification === null) {
      return;
    }

    acknowledgeDocumentApi(
      token,
      currentNotification.notification.historyId,
      currentNotification.notification.notificationId
    )
      .then((res) => {
        setAcknowledgementStatus(res.status);
        if (res.status === 200) {
          removeNotifications([
            {
              historyId: currentNotification.notification.historyId,
              notificationId: currentNotification.notification.notificationId,
            },
          ]);
        }
      })
      .catch((err) => {
        setError(err);
        setAcknowledgementStatus(err.status);
      });
  };

  useEffect(() => {
    const getNewNotification = () => {
      const newNotification = dequeueNotification();
      if (newNotification) {
        setCurrentNotification(newNotification);
      }
    };

    getNewNotification();
  }, []);

  if (currentNotification === null) {
    return;
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleNotificationModal();
        }
      }}
    >
      {currentNotification.type === "acknowledge" ? (
        <AcknowledgementModal
          acknowledgeDocument={acknowledgeDocument}
          acknowledgementStatus={acknowledgementStatus}
          currentNotification={currentNotification}
          error={error}
          setCurrentNotification={setCurrentNotification}
          toggleModal={toggleNotificationModal}
        />
      ) : (
        <ReturnModal
          acknowledgementStatus={acknowledgementStatus}
          currentNotification={currentNotification}
          error={error}
          setCurrentNotification={setCurrentNotification}
          toggleModal={toggleNotificationModal}
        />
      )}
    </div>
  );
}

interface ModalProps {
  toggleModal: () => void;
  acknowledgeDocument: () => void;
  acknowledgementStatus: number | undefined;
  error: IError | null;
  currentNotification: INotificationQueue | null;
  setCurrentNotification: React.Dispatch<
    React.SetStateAction<INotificationQueue | null>
  >;
}

function AcknowledgementModal({
  toggleModal,
  acknowledgeDocument,
  setCurrentNotification,
  acknowledgementStatus,
  error,
  currentNotification,
}: ModalProps) {
  const { notificationQueueLength, dequeueNotification } = useNotification();
  return (
    <div className="modal">
      <div className="modal-header">
        <h2>"Acknowledge Document"</h2>
        <div className="close-modal" role="button" onClick={toggleModal}>
          <MdOutlineClose size={18} />
        </div>
      </div>
      <div className="mx-4 mt-4 bg-[#e5e5e5] p-2 rounded-md">
        {acknowledgementStatus === 200 ? (
          <>
            <div className="w-full grid place-items-center">
              <img src="/success.png" alt="success image" />
              <p>Document acknowledged successfully</p>
            </div>
          </>
        ) : error ? (
          <>
            <div className="w-full grid place-items-center">
              <img src="/error.png" alt="success image" />
              <p>{error.data.message}</p>
            </div>
          </>
        ) : undefined}
        {currentNotification !== null ? (
          <p>
            <strong>{currentNotification.notification.sender.name}</strong> sent{" "}
            <strong>{currentNotification.notification.document.title}</strong>{" "}
            at{" "}
            <strong>
              {new Date(
                currentNotification.notification.history.sentTimestamp
              ).toUTCString()}
            </strong>
          </p>
        ) : undefined}
      </div>
      <div className="w-[100%] flex justify-between border-t border-t-[#e5e5e5] py-2 px-4 mt-4 gap-2">
        {notificationQueueLength > 1 ? (
          <button
            className="btn btn-outline"
            onClick={() => {
              const newNotification = dequeueNotification();
              if (newNotification) {
                setCurrentNotification(newNotification);
              } else {
                toggleModal();
              }
            }}
          >
            Next
          </button>
        ) : undefined}
        <>
          {acknowledgementStatus !== 200 ? (
            <button className="submit-btn" onClick={acknowledgeDocument}>
              Confirm
            </button>
          ) : undefined}
          <button className="submit-btn close" onClick={toggleModal}>
            Close
          </button>
        </>
      </div>
    </div>
  );
}

function ReturnModal({
  setCurrentNotification,
  toggleModal,
  acknowledgementStatus,
  currentNotification,
  error,
}: Omit<ModalProps, "acknowledgeDocument">) {
  const { notificationQueueLength, dequeueNotification } = useNotification();
  return (
    <div className="modal">
      <div className="modal-header">
        <h2>Sent Document Returned</h2>
        <div className="close-modal" role="button" onClick={toggleModal}>
          <MdOutlineClose size={18} />
        </div>
      </div>
      <div className="mx-4 mt-4 bg-[#e5e5e5] p-2 rounded-md">
        {acknowledgementStatus === 200 ? (
          <>
            <div className="w-full grid place-items-center">
              <img src="/success.png" alt="success image" />
              <p>Document acknowledged successfully</p>
            </div>
          </>
        ) : error ? (
          <>
            <div className="w-full grid place-items-center">
              <img src="/error.png" alt="success image" />
              <p>{error.data.message}</p>
            </div>
          </>
        ) : undefined}
        {currentNotification !== null ? (
          currentNotification.type === "acknowledge" ? (
            <p>
              <strong>{currentNotification.notification.sender.name}</strong>{" "}
              sent{" "}
              <strong>{currentNotification.notification.document.title}</strong>{" "}
              at{" "}
              <strong>
                {new Date(
                  currentNotification.notification.history.sentTimestamp
                ).toUTCString()}
              </strong>
            </p>
          ) : (
            <p>
              <strong>{currentNotification.notification.sender.name}</strong>{" "}
              returned{" "}
              <strong>{currentNotification.notification.document.title}</strong>{" "}
              with comment{" "}
              <strong>
                {currentNotification.notification.history.comment}
              </strong>{" "}
              at{" "}
              <strong>
                {new Date(
                  currentNotification.notification.history.sentTimestamp
                ).toUTCString()}
              </strong>
            </p>
          )
        ) : undefined}
      </div>
      <div className="w-[100%] flex justify-between border-t border-t-[#e5e5e5] py-2 px-4 mt-4 gap-2">
        {notificationQueueLength > 1 ? (
          <button
            className="btn btn-outline"
            onClick={() => {
              const newNotification = dequeueNotification();
              if (newNotification) {
                setCurrentNotification(newNotification);
              } else {
                toggleModal();
              }
            }}
          >
            Next
          </button>
        ) : undefined}
        <>
          <button className="submit-btn close" onClick={toggleModal}>
            Close
          </button>
        </>
      </div>
    </div>
  );
}
