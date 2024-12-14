import { useEffect, useState } from "react";
import {
  getAllArchiveDocumentRequestsAwaitingFulfillmentApi,
  fulfillRequestForArchiveDocumentApi,
} from "../../api/archive.api";
import { IArchiveTransaction } from "../../@types/archive";
import { IError } from "../../@types/error";
import { ClipLoader } from "react-spinners";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import { CiSearch } from "react-icons/ci";
import EmptyPage from "../../components/EmptyPage";
import { IMeta } from "../../@types/pagination";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function ArchivesPendingAcceptance() {
  const [requestsPendingAcceptance, setRequestsPendingAcceptance] = useState<
    IArchiveTransaction[]
  >([]);
  const [acceptedRequestsTransactionIds, setAcceptedRequestsTransactionIds] =
    useState<string[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
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

  const toggleAcceptRequestTransactionId = (transactionId: string) => {
    if (acceptedRequestsTransactionIds.some((id) => id === transactionId)) {
      setAcceptedRequestsTransactionIds((prev) =>
        prev.filter((id) => id !== transactionId)
      );
    } else {
      setAcceptedRequestsTransactionIds((prev) => [...prev, transactionId]);
    }
  };

  const acceptRequestForArchiveDocuments = () => {
    setApiLoading(true);
    fulfillRequestForArchiveDocumentApi(acceptedRequestsTransactionIds)
      .then((res) => {
        if (res.status === 200) {
          const unFulfilledRequests = res.data.unFulfilledRequests;
          setRequestsPendingAcceptance((prev) =>
            prev.filter((item) => unFulfilledRequests.includes(item))
          );
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

  useEffect(() => {
    const fetchRequestsPendingFulfillment = () => {
      setApiLoading(true);
      getAllArchiveDocumentRequestsAwaitingFulfillmentApi(
        start,
        limit,
        searchQuery
      )
        .then((res) => {
          if (res.status === 200) {
            setRequestsPendingAcceptance(res.data.awaitingFulfillment);
            setMeta(res.data.meta);
            setAcceptedRequestsTransactionIds([]);
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
    fetchRequestsPendingFulfillment();
  }, [start, limit, searchQuery]);

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

  if (apiLoading) {
    return <LoadingPage />;
  }

  if (apiError !== null) {
    return <ErrorPage message={apiError.data.message} />;
  }

  return (
    <div>
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
            placeholder="Search requests"
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
      {acceptedRequestsTransactionIds.length > 0 ? (
        <div className="w-full flex justify-end mt-4 px-4">
          <button onClick={acceptRequestForArchiveDocuments}>
            <div className="h-8 w-28 flex flex-row items-center justify-center bg-green-600 text-white text-sm rounded-md hover:opacity-80 duration:300">
              {apiLoading ? <ClipLoader loading={apiLoading} /> : <p>Accept</p>}
            </div>
          </button>
        </div>
      ) : undefined}
      {requestsPendingAcceptance.length > 0 ? (
        <>
          <div className="w-full flex flex-row items-center justify-end gap-2 px-4 py-2">
            <div className="flex flex-row items-center gap-2 text-xs text-gray-400">
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
          </div>
          <div className="my-4 px-4">
            <div className="w-full rounded-[12px] overflow-x-hidden border">
              <table>
                <thead>
                  <tr>
                    <th>Item number</th>
                    <th>File number</th>
                    <th>Description</th>
                    <th>Requested by</th>
                    <th>Department</th>
                    <th>Request Date</th>
                    <th>
                      <div className="hover:cursor-pointer hover:bg-gray-200 w-8 h-8 grid place-items-center rounded-full">
                        <input
                          type="checkbox"
                          name="mark-for-accepting"
                          onChange={() => {
                            if (acceptedRequestsTransactionIds.length === 0) {
                              setAcceptedRequestsTransactionIds(
                                requestsPendingAcceptance.map(
                                  (request) => request.transactionId
                                )
                              );
                            } else {
                              setAcceptedRequestsTransactionIds([]);
                            }
                          }}
                          className="hover:cursor-pointer"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requestsPendingAcceptance.map((request) => {
                    const {
                      archive,
                      department,
                      transactionId,
                      requestedBy,
                      requestedAt,
                    } = request;
                    return (
                      <tr className="relative" key={transactionId}>
                        <td data-cell="item number">{archive.itemNumber}</td>
                        <td data-cell="file number">{archive.fileNumber}</td>
                        <td data-cell="description">{archive.description}</td>
                        <td data-cell="requested by">{requestedBy.name}</td>
                        <td data-cell="department">{department}</td>
                        <td data-cell="requested at">
                          {new Date(requestedAt).toUTCString()}
                        </td>
                        <td data-cell="#">
                          <div className="hover:cursor-pointer hover:bg-gray-200 w-8 h-8 grid place-items-center rounded-full">
                            <input
                              type="checkbox"
                              name="mark-for-accepting"
                              onChange={() => {
                                toggleAcceptRequestTransactionId(transactionId);
                              }}
                              checked={acceptedRequestsTransactionIds.includes(
                                transactionId
                              )}
                              className="hover:cursor-pointer"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyPage message="No archive requests pending acceptance!" />
      )}
    </div>
  );
}
