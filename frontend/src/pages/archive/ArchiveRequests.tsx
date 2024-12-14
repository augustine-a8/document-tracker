import { useState, useEffect } from "react";

import { getAllUserArchiveDocumentRequestApi } from "../../api/archive.api";
import { IArchiveTransaction } from "../../@types/archive";
import { IError } from "../../@types/error";
import Status from "../../components/status";
import { CiSearch } from "react-icons/ci";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";
import { IMeta } from "../../@types/pagination";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function ArchiveRequest() {
  const [archiveRequests, setAllArchiveRequests] = useState<
    IArchiveTransaction[]
  >([]);
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

  useEffect(() => {
    const fetchAllArchiveRequests = () => {
      setApiLoading(true);
      getAllUserArchiveDocumentRequestApi(start, limit, searchQuery)
        .then((res) => {
          if (res.status === 200) {
            setAllArchiveRequests(res.data.userRequests);
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

    fetchAllArchiveRequests();
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
      {archiveRequests.length !== 0 ? (
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
            <div className="w-full rounded-[12px] overflow-hidden border">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item number</th>
                    <th>File number</th>
                    <th>Description</th>
                    <th>Requested at</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {archiveRequests.map((request, idx) => {
                    const { transactionId, archive, requestedAt, approved } =
                      request;
                    return (
                      <tr key={transactionId}>
                        <td data-cell="#">{idx + 1}</td>
                        <td data-cell="item number">{archive.itemNumber}</td>
                        <td data-cell="file number">{archive.fileNumber}</td>
                        <td data-cell="description">{archive.description}</td>
                        <td data-cell="requested at">
                          {new Date(requestedAt).toUTCString()}
                        </td>
                        <td data-cell="status">
                          {approved ? (
                            <Status status="approved" color="green" />
                          ) : (
                            <Status status="unapproved" color="red" />
                          )}
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
        <EmptyPage message="No requests for archive document!" />
      )}
    </div>
  );
}
