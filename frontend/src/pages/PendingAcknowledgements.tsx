import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PiKeyReturn } from "react-icons/pi";

import { acknowledgeMultipleDocumentsApi } from "../api/history.api";
import { useAuth } from "../hooks/useAuth";
import { IError } from "../@types/error";
import { useNotification } from "../hooks/useNotification";
import { IAcknowledgement, INotification } from "../@types/notification";
import EmptyComponent from "../components/EmptyComponent";
import ReturnDocument from "../components/ReturnDocument";

export default function PendingAcknowledgements() {
  const { token } = useAuth();
  const [acknowledgements, setAcknowledgements] = useState<IAcknowledgement[]>(
    []
  );
  const [error, setError] = useState<IError | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [documentToReturn, setDocumentToReturn] =
    useState<INotification | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);

  const { allNotifications, removeNotifications } = useNotification();

  const toggleShowReturnModal = () => {
    setShowReturnModal((prev) => !prev);
  };

  const toggleAcknowledgement = (ack: IAcknowledgement) => {
    if (
      acknowledgements.some(
        (_ack) =>
          _ack.historyId === ack.historyId &&
          _ack.notificationId === ack.notificationId
      )
    ) {
      setAcknowledgements((prev) =>
        prev.filter(
          (item) =>
            !(
              item.historyId === ack.historyId &&
              item.notificationId === ack.notificationId
            )
        )
      );
    } else {
      setAcknowledgements((prev) => [...prev, ack]);
    }
  };

  const acknowledgeMultipleDocuments = () => {
    acknowledgeMultipleDocumentsApi(token, acknowledgements)
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
  let allItems = allNotifications.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = allNotifications.slice(
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
      <main>
        {acknowledgements.length > 0 ? (
          <div className="w-full grid place-items-center mt-4">
            <button
              className="btn btn-outline send-btn"
              onClick={acknowledgeMultipleDocuments}
            >
              Acknowledge
            </button>
          </div>
        ) : undefined}
        {allNotifications.length > 0 ? (
          <>
            <div className="pagination">
              <p>
                {startIndex + 1} - {stopIndex > allItems ? allItems : stopIndex}{" "}
                of {allItems}
              </p>
              <div
                className="page-prev"
                role="button"
                onClick={goToPreviousPage}
              >
                <MdChevronLeft color="#463f3a" />
              </div>
              <div className="page-next" role="button" onClick={goToNextPage}>
                <MdChevronRight color="#463f3a" />
              </div>
            </div>
            <table className="document-table">
              <thead>
                <tr>
                  <th>
                    # <div></div>
                  </th>
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
                    historyId,
                    history,
                    sender,
                    document,
                    receiver,
                    notificationId,
                    acknowledged,
                  } = item;
                  return (
                    <tr key={historyId}>
                      <td>{idx + 1}</td>
                      <td>{document.title}</td>
                      <td>{document.type}</td>
                      <td>{sender.name}</td>
                      <td>{receiver.name}</td>
                      <td>{new Date(history.sentTimestamp).toUTCString()}</td>
                      <td>{history.comment}</td>
                      <td>
                        <input
                          type="checkbox"
                          name={`acknowledge-${historyId}`}
                          id=""
                          onChange={() => {
                            toggleAcknowledgement({
                              historyId,
                              notificationId,
                            });
                          }}
                          disabled={acknowledged}
                          defaultChecked={acknowledged}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-solid return-btn"
                          onClick={() => {
                            setDocumentToReturn(item);
                            toggleShowReturnModal();
                          }}
                        >
                          <div className="w-full flex flex-row items-center gap-2">
                            <PiKeyReturn size={18} />
                          </div>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <div className="grid place-items-center h-full">
            <EmptyComponent message="No pending acknowledgements" />
          </div>
        )}
      </main>
      {showReturnModal && documentToReturn !== null ? (
        <ReturnDocument
          toggleShowReturnModal={toggleShowReturnModal}
          documentToReturn={documentToReturn}
        />
      ) : undefined}
    </>
  );
}
