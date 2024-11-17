import { useState } from "react";

import { INotification } from "../@types/notification";
import { IArchiveTransaction, ITransaction } from "../@types/transaction";
import { acknowledgeDocumentApi } from "../api/transaction.api";
import { IError } from "../@types/error";
import LoadingComponent from "./LoadingComponent";
import { useNotification } from "../hooks/useNotification";

interface INotificationModalProps {
  isOpen: boolean;
  notification: INotification | null;
  closeModal: () => void;
}

export default function NotificationModal({
  isOpen,
  notification,
  closeModal,
}: INotificationModalProps) {
  if (!isOpen || notification === null) {
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
        {notification.notificationType === "acknowledge" ? (
          <AcknowledgeDocument
            notification={notification}
            closeModal={closeModal}
          />
        ) : notification.notificationType === "return" ? (
          <ReturnDocument notification={notification} closeModal={closeModal} />
        ) : notification?.notificationType === "archive_document_request" ? (
          <ArchiveRequest notification={notification} closeModal={closeModal} />
        ) : (
          <ArchiveRequestApproval
            notification={notification}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
}

interface IModalProps {
  notification: INotification;
  closeModal: () => void;
}

function AcknowledgeDocument({ notification, closeModal }: IModalProps) {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);

  const { removeNotifications } = useNotification();

  if (notification.notificationType === "acknowledge") {
    const { transaction } = notification;
    const { document, sender, comment, sentTimestamp } =
      transaction as ITransaction;

    const acknowledgeDocument = () => {
      setApiLoading(true);
      acknowledgeDocumentApi(
        notification.transactionId,
        notification.notificationId
      )
        .then((res) => {
          if (res.status === 200) {
            removeNotifications([
              {
                notificationId: notification.notificationId,
                transactionId: notification.transactionId,
              },
            ]);
            closeModal();
            return;
          }
          setApiError(res as IError);
        })
        .catch((err) => {
          setApiError(err);
        })
        .finally(() => {
          setApiLoading(false);
        });
    };

    return (
      <div className="flex flex-col gap-2 mb-2">
        <div className="modal-header">
          <p>Acknowledge Document</p>
        </div>
        {apiError !== null ? (
          <div className="px-4 text-sm text-red-600 border-b">
            <p className="text-center">{apiError.data.message}</p>
          </div>
        ) : undefined}
        <div className="px-4 pb-2 border-b">
          <p>
            {sender.name} sent {document.title} on{" "}
            {new Date(sentTimestamp).toUTCString()} with extra notes {comment}
          </p>
        </div>
        {apiLoading ? (
          <div className="h-8 px-4 grid place-items-center">
            <LoadingComponent isLoading={apiLoading} />
          </div>
        ) : (
          <div className="px-4 flex flex-row items-center justify-end gap-4">
            <button onClick={acknowledgeDocument}>
              <div className="bg-green-600 text-sm text-white px-4 h-7 flex items-center rounded-sm hover:cursor-pointer hover:opacity-80 duration-300">
                <p>Confirm</p>
              </div>
            </button>
            <button>
              <div className="bg-red-600 text-sm text-white px-4 h-7 flex items-center rounded-sm hover:cursor-pointer hover:opacity-80 duration-300">
                <p>Reject</p>
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }
  return undefined;
}

function ReturnDocument({ notification, closeModal }: IModalProps) {
  const { removeNotifications } = useNotification();
  if (notification.notificationType === "return") {
    const { transaction } = notification;
    const { document, sender, comment, sentTimestamp } =
      transaction as ITransaction;

    const confirm = () => {
      closeModal();
      removeNotifications([
        {
          notificationId: notification.notificationId,
          transactionId: notification.transactionId,
        },
      ]);
    };

    return (
      <div className="flex flex-col gap-2 pb-2">
        <div className="modal-header">
          <p>Document Returned</p>
        </div>
        <div className="px-4 text-sm text-gray-700 pb-2 border-b">
          <p>
            {sender.name} returned {document.title} on{" "}
            {new Date(sentTimestamp).toUTCString()} with extra notes {comment}
          </p>
        </div>
        <div className="px-4 flex items-center justify-end">
          <button onClick={confirm}>
            <div className="h-7 flex items-center px-4 bg-green-600 text-white text-sm hover:opacity-80 duration-300">
              <p>Confirm</p>
            </div>
          </button>
        </div>
      </div>
    );
  }
  return undefined;
}

function ArchiveRequest({ notification }: IModalProps) {
  if (notification.notificationType === "archive_document_request") {
    const { transaction } = notification;
    const { document, requestedAt, requester } =
      transaction as IArchiveTransaction;
    return (
      <>
        <div className="modal-header">
          <p>Archive Document Request</p>
        </div>
        <div>
          <p>
            {requester.name} has requested for {document.title} on{" "}
            {new Date(requestedAt).toUTCString()}
          </p>
          <div>
            <button>Accept</button>
            <button>Reject</button>
          </div>
        </div>
      </>
    );
  }
  return undefined;
}

function ArchiveRequestApproval({ notification }: IModalProps) {
  if (notification.notificationType === "request_approval") {
    const { transaction } = notification;
    const {
      document,
      requestApprover,
      status,
      requestedAt,
      requestApprovedAt,
    } = transaction as IArchiveTransaction;
    return (
      <>
        <div className="modal-header">
          <p>Archive Document Approval</p>
        </div>
        <div>
          <p>
            Request for {document.title} on{" "}
            {new Date(requestedAt).toUTCString()} has been {status} by{" "}
            {requestApprover.name} on{" "}
            {new Date(requestApprovedAt!).toUTCString()}
          </p>
        </div>
      </>
    );
  }
  return undefined;
}
