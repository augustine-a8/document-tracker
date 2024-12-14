import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import {
  getActiveDocByIdApi,
  forwardActiveDocApi,
  acknowledgeActiveDocumentApi,
  returnActiveDocumentApi,
} from "../../api/activeDoc.api";
import {
  IActiveDoc,
  IActiveDocTransaction,
  INewActiveDocTransaction,
} from "../../@types/activeDoc";
import DocumentTransactions from "../../components/DocumentTransactions";
import { BsFillSendFill } from "react-icons/bs";
import SendDocument from "./SendDocument";
import { IError } from "../../@types/error";
import { useAuth } from "../../hooks/useAuth";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";
import { ClipLoader } from "react-spinners";

export default function ActiveDocDetails() {
  const navigate = useNavigate();
  const { activeDocId } = useParams();

  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [activeDoc, setActiveDoc] = useState<IActiveDoc | null>(null);
  const [transactions, setTransactions] = useState<INewActiveDocTransaction[]>(
    []
  );
  const [unacknowledgedTransaction, setUnacknowledgedTransaction] =
    useState<INewActiveDocTransaction | null>(null);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sendDocumentLoading, setSendDocumentLoading] =
    useState<boolean>(false);
  const [sendDocumentError, setSendDocumentError] = useState<IError | null>(
    null
  );
  const [ackApiLoading, setAckApiLoading] = useState<boolean>(false);
  const [ackApiError, setAckApiError] = useState<IError | null>(null);

  const { getMyAccount } = useAuth();

  const myAccount = getMyAccount();

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    setSendDocumentError(null);
  };

  useEffect(() => {
    const fetchDocumentById = () => {
      setApiLoading(true);
      getActiveDocByIdApi(activeDocId!)
        .then((res) => {
          if (res.status === 200) {
            setActiveDoc(res.data.activeDoc);
            setTransactions(res.data.transactions);
            setUnacknowledgedTransaction(res.data.unacknowledgedTransaction);
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

    fetchDocumentById();
  }, []);

  const goBack = () => {
    navigate("/activeDoc/");
  };

  // const goToPreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prev) => prev - 1);
  //   }
  // };

  // const goToNextPage = () => {
  //   if (stopIndex < allItems) {
  //     setCurrentPage((prev) => prev + 1);
  //   }
  // };

  if (apiLoading) {
    return <LoadingPage />;
  }

  if (apiError !== null) {
    return <ErrorPage message={apiError.data.message} />;
  }

  if (activeDoc === null) {
    return;
  }

  const handleForwardDocument = (receiverId: string, comment: string) => {
    setSendDocumentLoading(true);
    setSendDocumentError(null);
    forwardActiveDocApi(activeDocId!, receiverId, comment)
      .then((res) => {
        if (res.status === 200) {
          // setTransactions((prev) => [...prev, res.data.transaction]);
          // setActiveDoc(res.data.activeDoc);
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

  const acknowledgeDocument = (
    transactionId: string,
    stateHistoryId: string
  ) => {
    setAckApiLoading(true);
    acknowledgeActiveDocumentApi([
      { sentTransactionId: transactionId, stateHistoryId },
    ])
      .then((res) => {
        if (res.status === 200) {
          setUnacknowledgedTransaction(null);
          return;
        }
        setAckApiError(res as IError);
      })
      .catch((err) => {
        setAckApiError(err);
      })
      .finally(() => {
        setAckApiLoading(false);
      });
  };

  const returnDocument = (transactionId: string, stateHistoryId: string) => {
    setAckApiLoading(true);
    returnActiveDocumentApi({
      sentTransactionId: transactionId,
      stateHistoryId,
    })
      .then((res) => {
        if (res.status === 200) {
          // setTransactions((prev) => [...prev, res.data.transaction]);
          setUnacknowledgedTransaction(null);
          return;
        }
        setAckApiError(res as IError);
      })
      .catch((err) => {
        setAckApiError(err);
      })
      .finally(() => {
        setAckApiLoading(false);
      });
  };

  const maxItemsPerPage = 4;
  let allItems = transactions.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = transactions.slice(
    startIndex,
    stopIndex > allItems ? allItems : stopIndex
  );

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full px-4 mt-2" onClick={goBack}>
          <button className="w-fit flex flex-row gap-2 items-center text-sm text-[#023e8a] hover:underline">
            <MdOutlineArrowBackIosNew />
            <p>Back</p>
          </button>
        </div>
        {
          <>
            <div className="px-4 py-2">
              <div className="grid grid-cols-[80%_1fr]">
                <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Subject</p>
                    <p className="lb-regular font-semibold">
                      {activeDoc.subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Reference number</p>
                    <p className="lb-regular">{activeDoc.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Current holder</p>
                    <p className="lb-regular">{activeDoc.currentHolder.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Creator</p>
                    <p className="lb-regular">{activeDoc.originator.name}</p>
                  </div>
                </div>
                <div className="grid place-items-center">
                  {ackApiLoading ? (
                    <ClipLoader size={20} />
                  ) : unacknowledgedTransaction !== null ? (
                    <div className="flex flex-col gap-2 w-full">
                      {ackApiError !== null ? (
                        <p>{ackApiError.data.message}</p>
                      ) : undefined}
                      <button
                        onClick={() => {
                          const transactionId =
                            unacknowledgedTransaction.transactionId;
                          const stateHistoryId =
                            unacknowledgedTransaction.stateHistories[0]
                              .stateHistoryId;

                          acknowledgeDocument(transactionId, stateHistoryId);
                        }}
                      >
                        <div className="h-8 w-full rounded-sm bg-green-600 text-white flex flex-row items-center justify-center gap-2 hover:opacity-80 duration-300">
                          <p>Acknowledge</p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          const transactionId =
                            unacknowledgedTransaction.transactionId;
                          const stateHistoryId =
                            unacknowledgedTransaction.stateHistories[0]
                              .stateHistoryId;
                          returnDocument(transactionId, stateHistoryId);
                        }}
                      >
                        <div className="h-8 w-full rounded-sm bg-red-600 text-white flex flex-row items-center justify-center gap-2 hover:opacity-80 duration-300">
                          <p>Return</p>
                        </div>
                      </button>
                    </div>
                  ) : activeDoc.currentHolder?.userId === myAccount?.userId ? (
                    <div className="w-full">
                      <button onClick={toggleModal} className="w-full">
                        <div className="h-8 w-full rounded-sm bg-[#023e8a] text-white flex flex-row items-center justify-center gap-2 hover:opacity-80 duration-300">
                          <BsFillSendFill />
                          <p className="text-sm">Forward</p>
                        </div>
                      </button>
                    </div>
                  ) : undefined}
                </div>
              </div>
            </div>
            {transactions.length > 0 ? (
              <>
                {/* <div className="w-full px-4 flex flex-row items-center justify-end gap-2">
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
                </div> */}
                <div className="w-fill px-4 mt-2 mb-4">
                  <DocumentTransactions
                    transactions={currentPageItems}
                    currentPage={currentPage}
                    maxItemsPerPage={maxItemsPerPage}
                  />
                </div>
              </>
            ) : (
              <EmptyPage message="No transactions for document" />
            )}
          </>
        }
      </div>
      {showModal ? (
        <SendDocument
          toggleModal={toggleModal}
          onSend={handleForwardDocument}
          sendDocumentLoading={sendDocumentLoading}
          sendDocumentError={sendDocumentError}
        />
      ) : undefined}
    </>
  );
}
