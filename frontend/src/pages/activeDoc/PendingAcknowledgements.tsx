import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { IError } from "../../@types/error";
import {
  getActiveDocsPendingAcknowledgementsApi,
  acknowledgeActiveDocumentApi,
} from "../../api/activeDoc.api";
import { IPendingAcknowledgements } from "../../@types/activeDoc";
import LoadingComponent from "../../components/LoadingComponent";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import { IMeta } from "../../@types/pagination";
import { CiSearch } from "react-icons/ci";

export default function PendingAcknowledgements() {
  const [allPendingAcknowledgements, setAllPendingAcknowledgements] = useState<
    IPendingAcknowledgements[]
  >([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [selectedAcknowledgements, setSelectedAcknowledgements] = useState<
    { sentTransactionId: string; stateHistoryId: string }[]
  >([]);
  const [toBeAcknowledgedApiLoading, setToBeAcknowledgedApiLoading] =
    useState<boolean>(false);
  const [toBeAcknowledgedApiError, setToBeAcknowledgedApiError] =
    useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  const [start, setStart] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    start: 0,
    end: 0,
  });

  useEffect(() => {
    const fetchPendingAcknowledgements = () => {
      setApiLoading(true);
      getActiveDocsPendingAcknowledgementsApi(start, limit, searchQuery)
        .then((res) => {
          if (res.status === 200) {
            setAllPendingAcknowledgements(res.data.pendingAcknowledgements);
            setMeta(res.data.meta);
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

    fetchPendingAcknowledgements();
  }, [start, limit, searchQuery]);

  const toggleAcknowledgement = (ack: {
    sentTransactionId: string;
    stateHistoryId: string;
  }) => {
    if (
      selectedAcknowledgements.some(
        (acknowledgement) =>
          ack.sentTransactionId === acknowledgement.sentTransactionId &&
          ack.stateHistoryId === acknowledgement.stateHistoryId
      )
    ) {
      setSelectedAcknowledgements((prev) =>
        prev.filter(
          (item) =>
            item.sentTransactionId !== ack.sentTransactionId &&
            item.stateHistoryId !== ack.stateHistoryId
        )
      );
    } else {
      setSelectedAcknowledgements((prev) => [...prev, ack]);
    }
  };

  const acknowledgeDocuments = () => {
    setToBeAcknowledgedApiLoading(false);
    acknowledgeActiveDocumentApi(selectedAcknowledgements)
      .then((res) => {
        if (res.status === 200) {
          setSelectedAcknowledgements([]);
          return;
        }
        setToBeAcknowledgedApiError(res as IError);
      })
      .catch((err) => {
        setToBeAcknowledgedApiError(err);
      })
      .finally(() => {
        setToBeAcknowledgedApiLoading(false);
      });
  };

  const goToPreviousPage = () => {
    if (start > limit) {
      setStart(start - limit);
    }
  };

  const goToNextPage = () => {
    if (meta.end === meta.total) {
      return;
    }
    setStart(start + limit);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setStart(1);
      setSearchQuery(search);
    }
  };

  const toggleCheckAll = () => {
    if (selectedAcknowledgements.length === allPendingAcknowledgements.length) {
      setSelectedAcknowledgements([]);
    } else {
      const result = allPendingAcknowledgements.flatMap((doc) =>
        doc.transactions.flatMap((transaction) =>
          transaction.stateHistories.map((stateHistory) => ({
            sentTransactionId: transaction.transactionId,
            stateHistoryId: stateHistory.stateHistoryId,
          }))
        )
      );
      setSelectedAcknowledgements(result);
    }
  };

  if (apiLoading) {
    return <LoadingPage />;
  }

  if (apiError !== null) {
    return <ErrorPage message={apiError.data.message} />;
  }

  return (
    <>
      <div className="w-full flex flex-row items-center justify-end px-4 py-2 border-b h-14">
        <div
          className={`flex flex-row items-center ${
            searchFocus ? "border-2" : "border"
          } ${
            searchFocus ? "border-gray-600" : "border-gray-300"
          } rounded-md px-2 text-gray-500 h-8`}
        >
          <input
            type="text"
            placeholder="Search for document"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="flex-1 outline-none border-none text-sm"
            onFocus={() => {
              setSearchFocus(true);
            }}
            onBlur={() => {
              setSearchFocus(false);
            }}
            onKeyDown={handleSearch}
          />
          <CiSearch />
        </div>
      </div>
      <div className="h-[calc(100%-98px)]">
        {selectedAcknowledgements.length > 0 ? (
          <div className="w-full flex flex-row items-center justify-end mt-4 px-4">
            <button
              className="w-32 h-8 border bg-green-600 rounded-md text-white hover:opacity-80 duration-300"
              onClick={acknowledgeDocuments}
            >
              {toBeAcknowledgedApiLoading ? (
                <LoadingComponent
                  isLoading={toBeAcknowledgedApiLoading}
                  size={18}
                />
              ) : (
                <p className="text-sm">Acknowledge</p>
              )}
            </button>
          </div>
        ) : undefined}
        {toBeAcknowledgedApiError !== null ? (
          <div className="w-full grid place-items-center mt-4">
            <p>{toBeAcknowledgedApiError.data.message}</p>
          </div>
        ) : undefined}
        {allPendingAcknowledgements.length > 0 ? (
          <>
            <div className="w-full flex flex-row items-center justify-end gap-2 text-sm text-gray-400 px-4 py-2">
              <div className="flex flex-row items-center gap-2">
                <label htmlFor="show">Show</label>
                <div className="border px-1 py-1 rounded-md w-8 overflow-hidden">
                  <input
                    type="text"
                    name="show"
                    id="show"
                    max={meta.total}
                    min={1}
                    value={limit}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        return;
                      }
                      const l = parseInt(e.target.value, 10);
                      if (l < 1 || l > meta.total) {
                        return;
                      }
                      setLimit(l);
                    }}
                    className="outline-none border-none"
                  />
                </div>
              </div>
              <p>
                {meta.start} - {meta.end} of {meta.total}
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
            <div className="px-4 mb-4">
              <div className="w-full rounded-[12px] overflow-hidden border">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div className="flex flex-row items-center gap-4">
                          <div>
                            <input
                              type="checkbox"
                              name=""
                              id=""
                              onChange={() => {
                                toggleCheckAll();
                              }}
                            />
                          </div>
                          <p>Subject</p>
                        </div>
                      </th>
                      <th>Reference number</th>
                      <th>Source</th>
                      <th>Forwarded Date</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPendingAcknowledgements.map(
                      (pendingAcknowledgement) => {
                        const { subject, referenceNumber, transactions } =
                          pendingAcknowledgement;

                        return transactions.map((transaction) => {
                          const { source, stateHistories } = transaction;
                          return stateHistories.map((history) => {
                            const { comment, date, stateHistoryId } = history;
                            return (
                              <tr key={stateHistoryId}>
                                <td>
                                  <div className="flex flex-row items-center gap-4">
                                    <div>
                                      <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        onChange={() => {
                                          toggleAcknowledgement({
                                            sentTransactionId:
                                              transaction.transactionId,
                                            stateHistoryId,
                                          });
                                        }}
                                      />
                                    </div>
                                    <p>{subject}</p>
                                  </div>
                                </td>
                                <td>
                                  <p>{referenceNumber}</p>
                                </td>
                                <td>
                                  <p>{source.name}</p>
                                </td>
                                <td>
                                  <p>{new Date(date).toISOString()}</p>
                                </td>
                                <td>
                                  <p>{comment}</p>
                                </td>
                              </tr>
                            );
                          });
                        });
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="grid place-items-center min-h-[calc(100vh-7rem)]">
            <p>No pending acknowledgements!</p>
          </div>
        )}
      </div>
    </>
  );
}
