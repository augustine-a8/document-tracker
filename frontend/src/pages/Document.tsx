import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import AddNewDocument from "../components/AddNewDocument";
import { addDocumentApi, getAllDocumentsApi } from "../api/document.api";
import { useAuth } from "../hooks/useAuth";
import { IDocument } from "../@types/document";
import { IError } from "../@types/error";
import EmptyComponent from "../components/EmptyComponent";
import LoadingComponent from "../components/LoadingComponent";

export default function Document() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { token } = useAuth();
  const [allDocuments, setAllDocuments] = useState<IDocument[]>([]);
  const [allDocumentsLoading, setAllDocumentsLoading] = useState<boolean>(true);
  const [error, setError] = useState<IError | null>(null);

  const [addNewDocumentLoading, setAddNewDocumentLoading] =
    useState<boolean>(false);
  const [addNewDocumentError, setAddNewDocumentError] = useState<IError | null>(
    null
  );

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

  useEffect(() => {
    const fetchAllDocuments = () => {
      setAllDocumentsLoading(true);
      getAllDocumentsApi(token)
        .then((res) => {
          if (res.status === 200) {
            setAllDocuments(res.data.allDocuments);
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
    addDocumentApi(token, { serialNumber, title, description, type })
      .then((res) => {
        if (res.status === 200) {
          toggleModal();
          setAllDocuments((prev) => [...prev, res.data.newDocument]);
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

  return (
    <>
      <main>
        <div className="document-head">
          <div>
            <button className="btn btn-solid" onClick={toggleModal}>
              Add Document
            </button>
          </div>
          <div className="document-search-box">
            <input type="text" placeholder="Search for document..." />
            <CiSearch />
          </div>
        </div>
        {allDocumentsLoading ? (
          <div className="grid place-items-center h-[calc(100%-58px)]">
            <LoadingComponent isLoading={allDocumentsLoading} />
          </div>
        ) : allDocuments.length > 0 ? (
          <AllDocumentsTable allDocuments={allDocuments} />
        ) : !allDocumentsLoading ? (
          <div className="grid place-items-center h-full">
            <EmptyComponent message="No documents here yet" />
          </div>
        ) : undefined}
      </main>
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

interface AllDocumentsTableProps {
  allDocuments: IDocument[];
}

function AllDocumentsTable({ allDocuments }: AllDocumentsTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const maxItemsPerPage = 10;
  let allItems = allDocuments.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = allDocuments.slice(
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

  return (
    <>
      <div className="pagination">
        <p>
          {startIndex + 1} - {stopIndex > allItems ? allItems : stopIndex} of{" "}
          {allItems}
        </p>
        <div className="page-prev" role="button" onClick={goToPreviousPage}>
          <MdChevronLeft color="#463f3a" />
        </div>
        <div className="page-next" role="button" onClick={goToNextPage}>
          <MdChevronRight color="#463f3a" />
        </div>
      </div>
      <table className="document-table">
        <thead>
          <tr>
            <th>
              # <div></div>
            </th>
            <th>Serial Number</th>
            <th>Title</th>
            <th>Description</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((item, idx) => {
            const { serialNumber, documentId, type, title, description } = item;
            return (
              <tr
                className="document-tr"
                onClick={() => {
                  goToDocument(documentId);
                }}
                key={documentId}
              >
                <td>{idx + startIndex + 1}</td>
                <td>{serialNumber}</td>
                <td>{title}</td>
                <td>{description}</td>
                <td>{type}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
