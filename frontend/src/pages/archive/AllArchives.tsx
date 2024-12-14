import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IArchive, INewArchive } from "../../@types/archive";
import {
  addToArchiveApi,
  getAllArchiveDocumentsApi,
} from "../../api/archive.api";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import AddToArchive from "./AddToArchive";
import { IError } from "../../@types/error";
import { useAuth } from "../../hooks/useAuth";
import { CiSearch } from "react-icons/ci";
import EmptyPage from "../../components/EmptyPage";
import ErrorPage from "../../components/ErrorPage";
import LoadingPage from "../../components/LoadingPage";
import { IMeta } from "../../@types/pagination";

export default function AllArchives() {
  const [archives, setArchives] = useState<IArchive[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [addToArchiveModalIsOpen, setAddToArchiveModalIsOpen] =
    useState<boolean>(false);
  const [addToArchiveLoading, setAddToArchiveLoading] =
    useState<boolean>(false);
  const [addToArchiveError, setAddToArchiveError] = useState<IError | null>(
    null
  );
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
  const navigate = useNavigate();
  const { getMyAccount } = useAuth();

  const myAccount = getMyAccount();

  useEffect(() => {
    const fetchAllArchiveDocuments = () => {
      setApiLoading(true);
      getAllArchiveDocumentsApi(start, limit, searchQuery)
        .then((res) => {
          if (res.status === 200) {
            setArchives(res.data.archives);
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
    fetchAllArchiveDocuments();
  }, [start, limit, searchQuery]);

  const toggleAddToArchiveModal = () => {
    setAddToArchiveModalIsOpen((prev) => !prev);
  };

  const addToArchive = (newArchive: INewArchive) => {
    setAddToArchiveLoading(true);
    addToArchiveApi(newArchive)
      .then((res) => {
        if (res.status === 200) {
          setArchives((prev) => [...prev, res.data.archive]);
          toggleAddToArchiveModal();
          return;
        }
        setAddToArchiveError(res as IError);
      })
      .catch((err) => {
        setAddToArchiveError(err);
      })
      .finally(() => {
        setAddToArchiveLoading(false);
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

  const viewArchive = (archiveId: string) => {
    navigate(`/archives/${archiveId}`);
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
    <>
      <div className="w-full flex flex-row items-center justify-between px-4 py-2 border-b h-14">
        {myAccount?.role === "archiver" ? (
          <div>
            <button
              className="border border-[#023e8a] px-4 h-8 rounded-md text-[#023e8a] hover:bg-[#023e8a] hover:text-white"
              onClick={toggleAddToArchiveModal}
            >
              <p className="text-sm">Add to archive</p>
            </button>
          </div>
        ) : undefined}
        {myAccount?.role !== "archiver" ? <div></div> : undefined}
        <div
          className={`flex flex-row items-center ${
            searchFocus ? "border-2" : "border"
          } ${
            searchFocus ? "border-gray-600" : "border-gray-300"
          } rounded-md px-2 text-gray-500 h-8`}
        >
          <input
            type="text"
            placeholder="Search archives"
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
      {archives.length > 0 ? (
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
          <div className="px-4">
            <div className="w-full border rounded-[12px] overflow-hidden">
              <table>
                <thead>
                  <tr>
                    <th>Archival Number</th>
                    <th>Item Number</th>
                    <th>Description</th>
                    <th>Covering Date</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody className="highlight">
                  {archives.map((item) => {
                    const {
                      archivalNumber,
                      itemNumber,
                      description,
                      coveringDate,
                      remarks,
                      archiveId,
                    } = item;
                    return (
                      <tr
                        key={archiveId}
                        onClick={() => {
                          viewArchive(archiveId);
                        }}
                      >
                        <td data-cell="archival number">{archivalNumber}</td>
                        <td data-cell="item number">{itemNumber}</td>
                        <td data-cell="description">{description}</td>
                        <td data-cell="covering date">{coveringDate}</td>
                        <td data-cell="remarks">{remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyPage message="Archives are empty" />
      )}
      <AddToArchive
        isOpen={addToArchiveModalIsOpen}
        toggleModal={toggleAddToArchiveModal}
        apiLoading={addToArchiveLoading}
        apiError={addToArchiveError}
        addToArchive={addToArchive}
      />
    </>
  );
}
