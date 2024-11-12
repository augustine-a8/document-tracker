import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { getDocumentByIdApi, sendDocumentApi } from "../api/document.api";
import { IDocument } from "../@types/document";
import DocumentHistory from "../components/DocumentHistory";
import { BsFillSendFill } from "react-icons/bs";
import SendDocument from "../components/SendDocument";
import { getMyAccountApi } from "../api/user.api";
import { IUser } from "../@types/user";
import { IError } from "../@types/error";
import { getHistoryForDocumentApi } from "../api/history.api";
import { IHistory } from "../@types/history";
import LoadingComponent from "../components/LoadingComponent";
import EmptyComponent from "../components/EmptyComponent";

export default function DocumentWithHistory() {
  const navigate = useNavigate();
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
      getMyAccountApi().then((res) => {
        if (res.status === 200) {
          setMe(res.data.myAccount);
        }
      });
    };

    fetchMyAccount();
  }, []);

  useEffect(() => {
    const fetchDocumentById = () => {
      getDocumentByIdApi(documentId!)
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
      getHistoryForDocumentApi(documentId!)
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
    sendDocumentApi(documentId!, receiverId, comment)
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

  const maxItemsPerPage = 6;
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
      <main className="flex flex-col">
        <div className="w-full px-4 mt-2" onClick={goBack}>
          <button className="w-fit flex flex-row gap-2 items-center text-sm text-[#023e8a] hover:underline">
            <MdOutlineArrowBackIosNew />
            <p>Back</p>
          </button>
        </div>
        {historyLoading ? (
          <div className="h-[calc(100%-62px)] grid place-items-center">
            <LoadingComponent isLoading={historyLoading} />
          </div>
        ) : (
          <>
            {document ? (
              <div className="w-full grid md:grid-cols-[2fr_1fr] pt-4 px-4">
                <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                  <div className="md:col-span-2">
                    <p className="lb-bold text-xl">{document.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Serial Number</p>
                    <p className="lb-regular"># {document.serialNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Document Type</p>
                    <p className="lb-regular">{document.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Current Holder</p>
                    <p className="lb-regular">{document.currentHolder?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Creator</p>
                    <p className="lb-regular">{document.creator?.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Description</p>
                    <p className="lb-regular">{document.description}</p>
                  </div>
                </div>
                <div className="grid place-items-center my-4 md:my-0">
                  {document.currentHolder?.userId === me?.userId ? (
                    <button
                      className="border border-[#007200] rounded-md text-[#007200] w-[60%] h-8 lb-regular hover:bg-[#007200] hover:text-white ease-in-out duration-300"
                      onClick={toggleModal}
                    >
                      <div className="flex flex-row items-center justify-center gap-2">
                        <BsFillSendFill />
                        <p className="text-sm">Send</p>
                      </div>
                    </button>
                  ) : undefined}
                </div>
              </div>
            ) : undefined}
            {history.length > 0 ? (
              <>
                <div className="w-full px-4 flex flex-row items-center justify-end gap-2">
                  <p className="text-sm text-gray-400">
                    {startIndex + 1} -{" "}
                    {stopIndex > allItems ? allItems : stopIndex} of {allItems}
                  </p>
                  <div
                    className="grid place-items-center w-8 h-8 rounded-full text-gray-500 hover:cursor-pointer hover:bg-[#ebebeb]"
                    role="button"
                    onClick={goToPreviousPage}
                  >
                    <MdChevronLeft />
                  </div>
                  <div
                    className="grid place-items-center w-8 h-8 rounded-full text-gray-500 hover:cursor-pointer hover:bg-[#ebebeb]"
                    role="button"
                    onClick={goToNextPage}
                  >
                    <MdChevronRight />
                  </div>
                </div>
                <div className="w-fill px-4">
                  <DocumentHistory history={currentPageItems} />
                </div>
              </>
            ) : (
              <div className="flex flex-1 mx-4 items-center justify-center border rounded-md">
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
