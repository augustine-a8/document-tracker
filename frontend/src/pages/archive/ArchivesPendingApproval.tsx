import { useEffect, useState } from "react";

import { IArchiveTransaction } from "../../@types/archive";
import {
  approveRequestForArchiveDocumentApi,
  getAllArchiveDocumentRequestsAwaitingApprovalApi,
} from "../../api/archive.api";
import { IError } from "../../@types/error";
import { ClipLoader } from "react-spinners";
import { CiSearch } from "react-icons/ci";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";
import { IMeta } from "../../@types/pagination";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function ArchivesPendingApproval() {
  const [requestsPendingApproval, setRequestsPendingApproval] = useState<
    IArchiveTransaction[]
  >([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<
    string[]
  >([]);
  const [approvalApiLoading, setApprovalApiLoading] = useState<boolean>(false);
  const [approvalApiError, setApprovalApiError] = useState<IError | null>(null);
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

  const approveRequestForArchiveDocument = () => {
    setApprovalApiLoading(true);
    approveRequestForArchiveDocumentApi(selectedTransactionIds)
      .then((res) => {
        if (res.status === 200) {
          const unapprovedTransactionIds = res.data.unapprovedTransactionIds;
          setSelectedTransactionIds([]);
          setRequestsPendingApproval((prev) =>
            prev.filter((item) =>
              unapprovedTransactionIds.includes(item.transactionId)
            )
          );
          return;
        }
        setApprovalApiError(res as IError);
      })
      .catch((err) => {
        setApprovalApiError(err);
      })
      .finally(() => {
        setApprovalApiLoading(false);
      });
  };

  const toggleTransactionId = (transactionId: string) => {
    if (selectedTransactionIds.some((id) => id === transactionId)) {
      setSelectedTransactionIds((prev) =>
        prev.filter((id) => id !== transactionId)
      );
    } else {
      setSelectedTransactionIds((prev) => [...prev, transactionId]);
    }
  };

  useEffect(() => {
    const fetchRequestsPendingApproval = () => {
      setApiLoading(true);
      getAllArchiveDocumentRequestsAwaitingApprovalApi(
        start,
        limit,
        searchQuery
      )
        .then((res) => {
          if (res.status === 200) {
            setRequestsPendingApproval(res.data.transactionsAwaitingApproval);
            setMeta(res.data.meta);
            setSelectedTransactionIds([]);
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

    fetchRequestsPendingApproval();
  }, []);

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
            placeholder="Search archive requests"
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
      {approvalApiError !== null ? (
        <div className="mt-2 px-4 flex flex-row justify-center items-center">
          <p>{approvalApiError.data.message}</p>
        </div>
      ) : undefined}
      {selectedTransactionIds.length > 0 ? (
        <div className="mt-4 px-4 flex flex-row justify-end">
          <button onClick={approveRequestForArchiveDocument}>
            <div className="h-8 w-32 bg-green-600 rounded-md grid place-items-center text-white text-sm hover:opacity-80 duration-300">
              {approvalApiLoading ? (
                <ClipLoader size={16} color="#fff" />
              ) : (
                <p>Approve</p>
              )}
            </div>
          </button>
        </div>
      ) : undefined}
      {requestsPendingApproval.length > 0 ? (
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
          <div className="px-4 my-4">
            <div className="w-full rounded-[12px] border">
              <table className="overflow-hidden">
                <thead>
                  <tr>
                    <th className="top-left">#</th>
                    <th>Item number</th>
                    <th>File number</th>
                    <th>Description</th>
                    <th>Requested by</th>
                    <th>Request Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsPendingApproval.map((request, idx) => {
                    const { transactionId, archive, requestedAt, requestedBy } =
                      request;
                    return (
                      <tr className="relative" key={transactionId}>
                        <td data-cell="#">{idx + 1}</td>
                        <td data-cell="item number">{archive.itemNumber}</td>
                        <td data-cell="file number">{archive.fileNumber}</td>
                        <td data-cell="description">{archive.description}</td>
                        <td data-cell="requested by">{requestedBy.name}</td>
                        <td data-cell="requested at">
                          {new Date(requestedAt).toUTCString()}
                        </td>
                        <td data-cell="actions" className="relative">
                          <input
                            type="checkbox"
                            name={`${idx}`}
                            id={`${idx}`}
                            checked={selectedTransactionIds.includes(
                              transactionId
                            )}
                            onChange={() => {
                              toggleTransactionId(transactionId);
                            }}
                          />
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
        <EmptyPage message="No pending approvals for archive document!" />
      )}
    </div>
  );
}
