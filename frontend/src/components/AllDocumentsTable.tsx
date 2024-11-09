import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { IDocument } from "../@types/document";

interface AllDocumentsTableProps {
  allDocuments: IDocument[];
}

export default function AllDocumentsTable({
  allDocuments,
}: AllDocumentsTableProps) {
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
      <div className="w-full flex flex-row items-center justify-end gap-2 text-xs text-gray-400 px-4 py-2">
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
      <div className="w-full px-4">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#023e8a] text-white">
            <tr>
              <th className="font-normal text-left p-2">#</th>
              <th className="font-normal text-left p-2">Serial Number</th>
              <th className="font-normal text-left p-2">Title</th>
              <th className="font-normal text-left p-2">Description</th>
              <th className="font-normal text-left p-2">Type</th>
            </tr>
          </thead>
          <tbody className="all-documents">
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
                  <td className="font-normal text-left p-2">
                    {idx + startIndex + 1}
                  </td>
                  <td className="font-normal text-left p-2">{serialNumber}</td>
                  <td className="font-normal text-left p-2">{title}</td>
                  <td className="font-normal text-left p-2">{description}</td>
                  <td className="font-normal text-left p-2">{type}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
