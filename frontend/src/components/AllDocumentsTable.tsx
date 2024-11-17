import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { IDocument } from "../@types/document";
import { addDocumentApi, getAllDocumentsApi } from "../api/document.api";
import { IError } from "../@types/error";
import LoadingComponent from "./LoadingComponent";
import EmptyComponent from "./EmptyComponent";
import AddNewDocument from "./AddNewDocument";
import { IoMdAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

export default function AllDocumentsTable() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [allDocuments, setAllDocuments] = useState<IDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);
  const [allDocumentsLoading, setAllDocumentsLoading] = useState<boolean>(true);
  const [error, setError] = useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [addNewDocumentLoading, setAddNewDocumentLoading] =
    useState<boolean>(false);
  const [addNewDocumentError, setAddNewDocumentError] = useState<IError | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDocuments = () => {
      setAllDocumentsLoading(true);
      getAllDocumentsApi()
        .then((res) => {
          if (res.status === 200) {
            setAllDocuments(res.data.allDocuments);
            setFilteredDocuments(res.data.allDocuments);
          }
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setAllDocumentsLoading(false);
        });
    };

    fetchAllDocuments();
  }, []);

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

  const maxItemsPerPage = 10;
  let allItems = filteredDocuments.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = filteredDocuments.slice(
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

  const goToDocument = (documentId: string) => {
    navigate(`/documents/${documentId}`);
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const addNewDocument = (
    serialNumber: string,
    title: string,
    description: string,
    type: string
  ) => {
    setAddNewDocumentLoading(true);
    setAddNewDocumentError(null);
    addDocumentApi({ serialNumber, title, description, type })
      .then((res) => {
        if (res.status === 200) {
          toggleModal();
          setAllDocuments((prev) => [...prev, res.data.newDocument]);
          setFilteredDocuments((prev) => [...prev, res.data.newDocument]);
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

  if (allDocumentsLoading) {
    return (
      <div className="grid place-items-center h-[calc(100%-98px)]">
        <LoadingComponent isLoading={allDocumentsLoading} />
      </div>
    );
  }

  if (!allDocumentsLoading && allDocuments.length === 0) {
    return (
      <div className="grid place-items-center h-[calc(100%-98px)]">
        <EmptyComponent message="No documents here yet" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between px-4 py-2 border-b h-14">
        <div className="hidden md:block">
          <button
            className="border border-[#023e8a] w-32 h-8 rounded-md text-[#023e8a] hover:bg-[#023e8a] hover:text-white ease-in-out duration-300"
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
        <div className="flex flex-row items-center border rounded-md px-2 text-gray-500 h-8">
          <input
            type="text"
            placeholder="Search for document"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setFilteredDocuments(
                allDocuments.filter(
                  (document) =>
                    document.title
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase()) ||
                    document.serialNumber.includes(e.target.value)
                )
              );
            }}
            className="flex-1 outline-none border-none text-sm"
          />
          <CiSearch />
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-between gap-2 px-4 py-2">
        <div>
          <p className="lb-regular text-base md:text-transparent">
            All Documents
          </p>
        </div>
        <div className="flex flex-row items-center gap-2 text-xs text-gray-400">
          <p>
            {startIndex + 1} - {stopIndex > allItems ? allItems : stopIndex} of{" "}
            {allItems}
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
        <div className="w-full rounded-[12px] overflow-hidden border">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Serial Number</th>
                <th>Title</th>
                <th>Description</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.map((item, idx) => {
                const { serialNumber, documentId, type, title, description } =
                  item;
                return (
                  <tr
                    onClick={() => {
                      goToDocument(documentId);
                    }}
                    key={documentId}
                  >
                    <td data-cell="#">{idx + startIndex + 1}</td>
                    <td data-cell="serial number">{serialNumber}</td>
                    <td data-cell="title">{title}</td>
                    <td data-cell="description">{description}</td>
                    <td data-cell="type">{type}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
