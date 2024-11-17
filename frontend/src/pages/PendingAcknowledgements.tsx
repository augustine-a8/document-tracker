import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PiKeyReturn } from "react-icons/pi";

import { acknowledgeMultipleDocumentsApi } from "../api/transaction.api";
import { IError } from "../@types/error";
import { useNotification } from "../hooks/useNotification";
import { IAcknowledgement, INotification } from "../@types/notification";
import EmptyComponent from "../components/EmptyComponent";
import ReturnDocument from "../components/ReturnDocument";
import { ITransaction } from "../@types/transaction";
import { TiCancel } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";

export default function PendingAcknowledgements() {
  const [acknowledgements, setAcknowledgements] = useState<IAcknowledgement[]>(
    []
  );
  const [error, setError] = useState<IError | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [notificationToReturn, setNotificationToReturn] =
    useState<INotification | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);

  const { notificationQueue, removeNotifications } = useNotification();

  const toggleShowReturnModal = () => {
    setShowReturnModal((prev) => !prev);
  };

  const toggleAcknowledgement = (ack: IAcknowledgement) => {
    if (
      acknowledgements.some(
        (_ack) =>
          _ack.transactionId === ack.transactionId &&
          _ack.notificationId === ack.notificationId
      )
    ) {
      setAcknowledgements((prev) =>
        prev.filter(
          (item) =>
            !(
              item.transactionId === ack.transactionId &&
              item.notificationId === ack.notificationId
            )
        )
      );
    } else {
      setAcknowledgements((prev) => [...prev, ack]);
    }
  };

  const acknowledgeMultipleDocuments = () => {
    acknowledgeMultipleDocumentsApi(acknowledgements)
      .then((res) => {
        if (res.status === 200) {
          removeNotifications(acknowledgements);
          setAcknowledgements([]);
          return;
        }
        setError(res as IError);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const maxItemsPerPage = 12;
  let allItems = notificationQueue.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = notificationQueue.slice(
    startIndex,
    stopIndex > allItems ? allItems : stopIndex
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (stopIndex < allItems) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="h-[calc(100%-98px)]">
        {acknowledgements.length > 0 ? (
          <div className="w-full grid place-items-center mt-4">
            <button
              className="w-32 h-8 border border-[#007200] rounded-md text-[#007200] hover:bg-[#007200] hover:text-white"
              onClick={acknowledgeMultipleDocuments}
            >
              <p className="text-sm">Acknowledge</p>
            </button>
          </div>
        ) : undefined}
        {notificationQueue.length > 0 ? (
          <>
            <div className="w-full flex flex-row items-center justify-end gap-2 text-sm text-gray-400 px-4 py-2">
              <p>
                {startIndex + 1} - {stopIndex > allItems ? allItems : stopIndex}{" "}
                of {allItems}
              </p>
              <div
                className="grid place-items-center w-8 h-8 rounded-full text-gray-500 hover:cursor-pointer hover:bg-[#ebebeb]"
                role="button"
                onClick={goToPreviousPage}
              >
                <MdChevronLeft color="#463f3a" />
              </div>
              <div
                className="grid place-items-center w-8 h-8 rounded-full text-gray-500 hover:cursor-pointer hover:bg-[#ebebeb]"
                role="button"
                onClick={goToNextPage}
              >
                <MdChevronRight color="#463f3a" />
              </div>
            </div>
            <div className="w-full px-4">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Sent At</th>
                    <th>Comment</th>
                    <th>Acknowledge</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((item, idx) => {
                    const {
                      transactionId,
                      transaction,
                      notificationType,
                      notificationId,
                    } = item;
                    if (
                      notificationType === "archive_document_request" ||
                      notificationType === "request_approval"
                    ) {
                      return;
                    }
                    const {
                      document,
                      sender,
                      receiver,
                      sentTimestamp,
                      acknowledged,
                    } = transaction as ITransaction;
                    return (
                      <tr
                        key={transactionId}
                        className="hover:shadow-none hover:cursor-default"
                      >
                        <td>{idx + 1}</td>
                        <td>{document.title}</td>
                        <td>{document.type}</td>
                        <td>{sender.name}</td>
                        <td>{receiver.name}</td>
                        <td>{new Date(sentTimestamp).toUTCString()}</td>
                        <td>{transaction.comment}</td>
                        <td>
                          <input
                            type="checkbox"
                            name={`acknowledge-${transactionId}`}
                            id=""
                            onChange={() => {
                              toggleAcknowledgement({
                                transactionId,
                                notificationId,
                              });
                            }}
                            disabled={acknowledged}
                            defaultChecked={acknowledged}
                          />
                        </td>
                        <td>
                          {notificationType === "acknowledge" ? (
                            <button
                              onClick={() => {
                                setNotificationToReturn(item);
                                toggleShowReturnModal();
                              }}
                            >
                              <div className="border border-red-600 bg-red-600 rounded-sm text-white h-7 flex items-center gap-2 px-2 hover:cursor-pointer hover:opacity-80 duration-300">
                                <PiKeyReturn />
                                <p>Return</p>
                              </div>
                            </button>
                          ) : (
                            <button>
                              <div className="border border-green-600 bg-green-600 rounded-sm text-white h-7 flex items-center gap-2 px-2 hover:cursor-pointer hover:opacity-80 duration-300">
                                <FaCheck />
                                <p>Confirm</p>
                              </div>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="grid place-items-center h-full">
            <EmptyComponent message="No pending acknowledgements" />
          </div>
        )}
      </div>
      {showReturnModal && notificationToReturn !== null ? (
        <ReturnDocument
          toggleShowReturnModal={toggleShowReturnModal}
          notificationForDocumentToReturn={notificationToReturn}
        />
      ) : undefined}
    </>
  );
}
