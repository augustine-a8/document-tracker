import { useState, useEffect } from "react";

import { getAllArchiveRequestsApi } from "../api/archive.api";
import { IArchiveTransaction } from "../@types/archive";
import { PiDotOutlineFill } from "react-icons/pi";

export default function ArchiveRequest() {
  const [archiveRequests, setAllArchiveRequests] = useState<
    IArchiveTransaction[]
  >([]);

  useEffect(() => {
    const fetchAllArchiveRequests = () => {
      getAllArchiveRequestsApi().then((res) => {
        if (res.status === 200) {
          setAllArchiveRequests(res.data.allUserArchiveRequests);
        }
      });
    };

    fetchAllArchiveRequests();
  }, []);

  return (
    <div className="my-4 px-4">
      <div className="w-full rounded-[12px] overflow-hidden border my-4">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Document</th>
              <th>Requested At</th>
              <th>Approver</th>
              <th>Comment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {archiveRequests.map((request, idx) => {
              const {
                archiveTransactionId,
                archiveDocument,
                requestedAt,
                requestApprover,
                status,
                comment,
              } = request;
              return (
                <tr key={archiveTransactionId}>
                  <td data-cell="#">{idx + 1}</td>
                  <td data-cell="document">{archiveDocument.title}</td>
                  <td data-cell="requested at">
                    {new Date(requestedAt).toUTCString()}
                  </td>
                  <td data-cell="approver">{requestApprover.name}</td>
                  <td data-cell="comment">{comment}</td>
                  <td data-cell="status">
                    <div
                      className={`rounded-full h-6 w-fit pl-2 pr-4 flex flex-row items-center gap-1 justify-center ${
                        status === "submitted"
                          ? " text-yellow-600 bg-yellow-100"
                          : status === "approved"
                          ? "text-green-600 bg-green-100"
                          : status === "rejected"
                          ? " text-red-600 bg-red-100"
                          : " text-blue-600 bg-blue-100"
                      }`}
                    >
                      <PiDotOutlineFill className="text-xl" />
                      <p className="text-xs capitalize">{status}</p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
