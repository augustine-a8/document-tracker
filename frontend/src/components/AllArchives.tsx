import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IArchiveDocument } from "../@types/document";
import { getAllArchivedDocumentsApi } from "../api/archive.api";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function AllArchives() {
  const [allArchivedDocuments, setAllArchivedDocuments] = useState<
    IArchiveDocument[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllArchiveDocuments = () => {
      getAllArchivedDocumentsApi().then((res) => {
        if (res.status === 200) {
          setAllArchivedDocuments(res.data.allArchivedDocuments);
        }
      });
    };
    fetchAllArchiveDocuments();
  }, []);

  const maxItemsPerPage = 10;
  let allItems = allArchivedDocuments.length;
  let itemsPerPage = allItems < maxItemsPerPage ? allItems : maxItemsPerPage;
  let startIndex = (currentPage - 1) * itemsPerPage;
  let stopIndex = currentPage * itemsPerPage;
  let currentPageItems = allArchivedDocuments.slice(
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

  const viewArchive = (archiveId: string) => {
    navigate(`/archives/${archiveId}`);
  };

  return (
    <div className=" py-2">
      {allArchivedDocuments.length > 0 ? (
        <div className="w-full flex flex-row items-center justify-end">
          {/* <div>
            <p className="lb-regular text-sm">All Archived Documents</p>
          </div> */}
          <div className="flex flex-row items-center text-xs text-gray-400">
            <p>
              {startIndex + 1} - {stopIndex > allItems ? allItems : stopIndex}{" "}
              of {allItems}
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
      ) : undefined}
      <div className="px-4">
        <div className="w-full border rounded-[12px] overflow-hidden">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Serial Number</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.map((item, idx) => {
                const {
                  archiveDocumentId,
                  location,
                  serialNumber,
                  title,
                  type,
                } = item;
                return (
                  <tr
                    key={archiveDocumentId}
                    onClick={() => {
                      viewArchive(archiveDocumentId);
                    }}
                  >
                    <td data-cell="#">{idx + startIndex + 1}</td>
                    <td data-cell="serial number">{serialNumber}</td>
                    <td data-cell="title">{title}</td>
                    <td data-cell="type">{type}</td>
                    <td data-cell="location">{location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
