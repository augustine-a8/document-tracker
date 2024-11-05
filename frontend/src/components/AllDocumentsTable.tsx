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
