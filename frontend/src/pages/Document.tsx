import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

import AddNewDocument from "../components/AddNewDocument";
import { addDocumentApi, getAllDocumentsApi } from "../api/document.api";
import { useAuth } from "../hooks/useAuth";
import { IDocument } from "../@types/document";
import { IError } from "../@types/error";
import EmptyComponent from "../components/EmptyComponent";
import LoadingComponent from "../components/LoadingComponent";
import AllDocumentsTable from "../components/AllDocumentsTable";
import { IoMdAdd } from "react-icons/io";

export default function Document() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [allDocuments, setAllDocuments] = useState<IDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);
  const [allDocumentsLoading, setAllDocumentsLoading] = useState<boolean>(true);
  const [error, setError] = useState<IError | null>(null);
  const [search, setSearch] = useState<string>("");

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

  return (
    <>
      <main>
        <div className="w-full flex flex-row items-center justify-between px-4 py-2 border-b">
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
              placeholder="Search for document..."
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
        {allDocumentsLoading ? (
          <div className="grid place-items-center h-[calc(100%-58px)]">
            <LoadingComponent isLoading={allDocumentsLoading} />
          </div>
        ) : allDocuments.length > 0 ? (
          <AllDocumentsTable allDocuments={filteredDocuments} />
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
