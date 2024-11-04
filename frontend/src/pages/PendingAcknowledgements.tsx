import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import {
  acknowledgeMultipleDocumentsApi,
  getAllCustodyHistoryApi,
} from "../api/history.api";
import { useAuth } from "../hooks/useAuth";
import { IHistory } from "../@types/history";
import { IError } from "../@types/error";
import { useNotificationModal } from "../hooks/useNotificationModal";
import { IAcknowledgement } from "../@types/notification";
import EmptyComponent from "../components/EmptyComponent";

export default function PendingAcknowledgements() {
  const { token } = useAuth();
  const [acknowledgements, setAcknowledgements] = useState<IAcknowledgement[]>(
    []
  );
  const [error, setError] = useState<IError | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { allNotifications, removeNotifications } = useNotificationModal();

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
          //TODO: Remove acknowledged documents from allNotifications
          removeNotifications(acknowledgements);
          setAcknowledgements([]);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const maxItemsPerPage = 10;
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
            <div className="page-prev" role="button" onClick={goToPreviousPage}>
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
                          toggleAcknowledgement({ historyId, notificationId });
                        }}
                        disabled={acknowledged}
                        defaultChecked={acknowledged}
                      />
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
  );
}
