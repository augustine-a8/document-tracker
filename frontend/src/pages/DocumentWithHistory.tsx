import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getDocumentByIdApi, sendDocumentApi } from "../api/document.api";
import { IDocument } from "../@types/document";
import DocumentHistory from "../components/DocumentHistory";
import { BsFillSendFill } from "react-icons/bs";
import SendDocument from "../components/SendDocument";
import { getMyAccountApi } from "../api/user.api";
import { IUser } from "../@types/user";
import Tag from "../components/Tag";
import { IError } from "../@types/error";
import { getHistoryForDocumentApi } from "../api/history.api";
import { IHistory } from "../@types/history";
import LoadingComponent from "../components/LoadingComponent";
import EmptyComponent from "../components/EmptyComponent";

export default function DocumentWithHistory() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { documentId } = useParams();

  const [document, setDocument] = useState<IDocument | null>(null);
  const [error, setError] = useState<IError | null>(null);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyError, setHistoryError] = useState<IError | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [me, setMe] = useState<IUser | null>(null);
  const [sendDocumentLoading, setSendDocumentLoading] =
    useState<boolean>(false);
  const [sendDocumentError, setSendDocumentError] = useState<IError | null>(
    null
  );

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setSendDocumentError(null);
  };

  useEffect(() => {
    const fetchMyAccount = () => {
      getMyAccountApi(token).then((res) => {
        if (res.status === 200) {
          setMe(res.data.myAccount);
        }
      });
    };

    fetchMyAccount();
  }, []);

  useEffect(() => {
    const fetchDocumentById = () => {
      getDocumentByIdApi(documentId!, token)
        .then((res) => {
          if (res.status === 200) {
            setDocument(res.data.document);
          }
        })
        .catch((err) => {
          setError(err);
        });
    };

    fetchDocumentById();
  }, []);

  useEffect(() => {
    const fetchDocumentHistory = () => {
      getHistoryForDocumentApi(token, documentId!)
        .then((res) => {
          if (res.status === 200) {
            setHistory(res.data.custodyHistory);
          }
        })
        .catch((err) => {
          setHistoryError(err);
        })
        .finally(() => {
          setHistoryLoading(false);
        });
    };

    fetchDocumentHistory();
  }, []);

  const goBack = () => {
    navigate("/documents");
  };

  const handleSendDocument = (receiverId: string, comment: string) => {
    setSendDocumentLoading(true);
    setSendDocumentError(null);
    sendDocumentApi(token, documentId!, receiverId, comment)
      .then((res) => {
        if (res.status === 200) {
          setHistory((prev) => [...prev, res.data.history]);
          setDocument(res.data.document);
          toggleModal();
        } else {
          setSendDocumentError(res as IError);
        }
      })
      .catch((err) => {
        setSendDocumentError(err);
      })
      .finally(() => {
        setSendDocumentLoading(false);
      });
  };

  const maxItemsPerPage = 10;
  let allItems = history.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = history.slice(
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
        <div className="dwh-header" role="button" onClick={goBack}>
          <MdOutlineArrowBackIosNew color="#023e8a" />
          <p>Back</p>
        </div>
        {historyLoading ? (
          <div className="h-[calc(100%-62px)] grid place-items-center">
            <LoadingComponent isLoading={historyLoading} />
          </div>
        ) : (
          <>
            {document ? (
              <div className="w-[100%] flex flex-row">
                <div className="dwh-card-group">
                  <div className="dwh-card">
                    <p>Serial Number</p>
                    <p>{document.serialNumber}</p>
                  </div>
                  <div className="dwh-card">
                    <p>Title</p>
                    <p>{document.title}</p>
                  </div>

                  <div className="dwh-card">
                    <p>Current holder</p>
                    {document.currentHolderId === me?.userId ? (
                      <Tag title="me" />
                    ) : (
                      <p>{document.currentHolder?.name}</p>
                    )}
                  </div>
                  <div className="dwh-card">
                    <p>Type</p>
                    {document.type}
                  </div>
                  <div className="dwh-card">
                    <p>Description</p>
                    <p>{document.description}</p>
                  </div>
                </div>
                {document.currentHolderId == me?.userId ? (
                  <div className="flex flex-1 flex-col mr-4">
                    <div>
                      <button
                        className="btn btn-outline send-btn"
                        onClick={toggleModal}
                      >
                        <div className="flex flex-row gap-2 items-center">
                          <BsFillSendFill size={14} />
                          <p>Send</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : undefined}
              </div>
            ) : undefined}
            {history.length > 0 ? (
              <>
                <div className="pagination">
                  <p>
                    {startIndex + 1} -{" "}
                    {stopIndex > allItems ? allItems : stopIndex} of {allItems}
                  </p>
                  <div
                    className="page-prev"
                    role="button"
                    onClick={goToPreviousPage}
                  >
                    <MdChevronLeft color="#463f3a" />
                  </div>
                  <div
                    className="page-next"
                    role="button"
                    onClick={goToNextPage}
                  >
                    <MdChevronRight color="#463f3a" />
                  </div>
                </div>
                <DocumentHistory history={currentPageItems} />
              </>
            ) : (
              <div className="grid place-items-center h-auto">
                <EmptyComponent message="No transfer history for document" />
              </div>
            )}
          </>
        )}
      </main>
      {showModal ? (
        <SendDocument
          toggleModal={toggleModal}
          onSend={handleSendDocument}
          sendDocumentLoading={sendDocumentLoading}
          sendDocumentError={sendDocumentError}
        />
      ) : undefined}
    </>
  );
}
