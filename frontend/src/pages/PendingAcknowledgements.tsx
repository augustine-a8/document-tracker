import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PiKeyReturn } from "react-icons/pi";

import { acknowledgeMultipleDocumentsApi } from "../api/history.api";
import { IError } from "../@types/error";
import { useNotification } from "../hooks/useNotification";
import { IAcknowledgement, INotification } from "../@types/notification";
import EmptyComponent from "../components/EmptyComponent";
import ReturnDocument from "../components/ReturnDocument";

export default function PendingAcknowledgements() {
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
              className="w-32 h-8 border border-[#007200] rounded-md text-[#007200] hover:bg-[#007200] hover:text-white"
              onClick={acknowledgeMultipleDocuments}
            >
              <p className="text-sm">Acknowledge</p>
            </button>
          </div>
        ) : undefined}
        {allNotifications.length > 0 ? (
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
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#023e8a] text-white">
                  <tr>
                    <th>
                      # <div></div>
                    </th>
                    <th className="font-normal text-left p-2">Title</th>
                    <th className="font-normal text-left p-2">Type</th>
                    <th className="font-normal text-left p-2">Sender</th>
                    <th className="font-normal text-left p-2">Receiver</th>
                    <th className="font-normal text-left p-2">Sent At</th>
                    <th className="font-normal text-left p-2">Comment</th>
                    <th className="font-normal text-left p-2">Acknowledge</th>
                    <th className="font-normal text-left p-2">Action</th>
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
                      <tr
                        key={historyId}
                        className="hover:shadow-none hover:cursor-default"
                      >
                        <td className="font-normal text-left p-2">{idx + 1}</td>
                        <td className="font-normal text-left p-2">
                          {document.title}
                        </td>
                        <td className="font-normal text-left p-2">
                          {document.type}
                        </td>
                        <td className="font-normal text-left p-2">
                          {sender.name}
                        </td>
                        <td className="font-normal text-left p-2">
                          {receiver.name}
                        </td>
                        <td className="font-normal text-left p-2">
                          {new Date(history.sentTimestamp).toUTCString()}
                        </td>
                        <td className="font-normal text-left p-2">
                          {history.comment}
                        </td>
                        <td className="font-normal text-left p-2">
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
                        <td className="font-normal text-left p-2">
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
            </div>
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
