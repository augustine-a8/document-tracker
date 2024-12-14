import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { IActiveDoc } from "../../@types/activeDoc";
import { getAllActiveDocsApi, addActiveDocApi } from "../../api/activeDoc.api";
import { IError } from "../../@types/error";
import AddNewDocument from "./AddNewDocument";
import { IoMdAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import EmptyPage from "../../components/EmptyPage";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import { IMeta } from "../../@types/pagination";

export default function AllActiveDocs() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeDocs, setActiveDocs] = useState<IActiveDoc[]>([]);
  const [allDocumentsLoading, setAllDocumentsLoading] = useState<boolean>(true);
  const [error, setError] = useState<IError | null>(null);
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

  const [addNewDocumentLoading, setAddNewDocumentLoading] =
    useState<boolean>(false);
  const [addNewDocumentError, setAddNewDocumentError] = useState<IError | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDocuments = () => {
      setAllDocumentsLoading(true);
      getAllActiveDocsApi(start, limit, searchQuery)
        .then((res) => {
          if (res.status === 200) {
            setActiveDocs(res.data.activeDocs);
            setMeta(res.data.meta);
            return;
          }
          setError(res as IError);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setAllDocumentsLoading(false);
        });
    };

    fetchAllDocuments();
  }, [start, limit, searchQuery]);

  useEffect(() => {
    const setDocumentScrolling = () => {
      if (showModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };

    setDocumentScrolling();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

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

  const goToDocument = (documentId: string) => {
    navigate(`/activeDoc/${documentId}`);
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const addNewDocument = (subject: string, referenceNumber: string) => {
    setAddNewDocumentLoading(true);
    setAddNewDocumentError(null);
    addActiveDocApi({ subject, referenceNumber })
      .then((res) => {
        if (res.status === 200) {
          toggleModal();
          setActiveDocs((prev) => [...prev, res.data.activeDoc]);
        } else {
          setAddNewDocumentError(res as IError);
        }
      })
      .catch((err) => {
        setAddNewDocumentError(err);
      })
      .finally(() => {
        setAddNewDocumentLoading(false);
      });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setStart(1);
      setSearchQuery(search);
    }
  };

  if (allDocumentsLoading) {
    return <LoadingPage />;
  }

  if (error !== null) {
    return <ErrorPage message={error.data.message} />;
  }

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between px-4 py-2 border-b h-14">
        <div className="hidden md:block">
          <button
            className="border border-[#023e8a] w-32 h-8 rounded-md bg-[#023e8a] text-white hover:opacity-80 ease-in-out duration-300"
            onClick={toggleModal}
          >
            <p className="text-sm">Add Document</p>
          </button>
        </div>
        <div className="block md:hidden">
          <button
            className="border border-[#023e8a] bg-[#023e8a] text-white w-8 h-8 grid place-items-center rounded-md"
            onClick={toggleModal}
          >
            <p className="text-sm text-white">
              <IoMdAdd />
            </p>
          </button>
        </div>
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
      {activeDocs.length > 0 ? (
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
          <div className="px-4 mb-4">
            <div className="w-full rounded-[12px] overflow-hidden border">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Reference number</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="highlight">
                  {activeDocs.map((item, idx) => {
                    const { subject, referenceNumber, createdAt, activeDocId } =
                      item;
                    return (
                      <tr
                        onClick={() => {
                          goToDocument(activeDocId);
                        }}
                        key={activeDocId}
                      >
                        <td data-cell="#">{idx + start}</td>
                        <td data-cell="subject">{subject}</td>
                        <td data-cell="reference number">{referenceNumber}</td>
                        <td data-cell="date">
                          {new Date(createdAt).toUTCString()}
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
        <EmptyPage message="No active documents for you!" />
      )}
      {showModal ? (
        <AddNewDocument
          toggleModal={toggleModal}
          addNewDocument={addNewDocument}
          addNewDocumentLoading={addNewDocumentLoading}
          addNewDocumentError={addNewDocumentError}
        />
      ) : undefined}
    </>
  );
}
