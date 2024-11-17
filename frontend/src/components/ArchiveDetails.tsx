import { useEffect, useState } from "react";
// import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useParams } from "react-router-dom";
import {
  getAllUserRequestsForDocumentApi,
  getArchivedDocumentByIdApi,
  requestForArchivedDocumentApi,
} from "../api/archive.api";
import { IArchiveDocument } from "../@types/document";
import { RxValueNone } from "react-icons/rx";
import { MdLocationPin } from "react-icons/md";
import { IArchiveTransaction } from "../@types/archive";
import RequestArchiveDocument from "./RequestArchiveDocument";
import { PiDotOutlineFill } from "react-icons/pi";

export default function ArchiveDetails() {
  const [archiveDocument, setArchiveDocument] = useState<IArchiveDocument>();
  const [archiveTransactions, setArchiveTransactions] = useState<
    IArchiveTransaction[]
  >([]);
  const [showRequestArchiveDocumentModal, setShowRequestArchiveDocumentModal] =
    useState<boolean>(false);
  const { archiveId } = useParams();

  useEffect(() => {
    const fetchArchiveDocumentById = () => {
      getArchivedDocumentByIdApi(archiveId!).then((res) => {
        if (res.status === 200) {
          setArchiveDocument(res.data.archivedDocument);
        }
      });
    };

    fetchArchiveDocumentById();
  }, []);

  useEffect(() => {
    const fetchAllUserRequestsForDocument = () => {
      getAllUserRequestsForDocumentApi(archiveId!).then((res) => {
        if (res.status === 200) {
          setArchiveTransactions(res.data.allUserRequests);
        }
      });
    };

    fetchAllUserRequestsForDocument();
  }, []);

  const toggleRequestArchiveDocumentModal = () => {
    setShowRequestArchiveDocumentModal((prev) => !prev);
  };

  const makeRequestForArchivedDocument = (
    requestApproverId: string,
    comment: string
  ) => {
    requestForArchivedDocumentApi(
      archiveDocument!.archiveDocumentId,
      requestApproverId,
      comment
    )
      .then((res) => {
        if (res.status === 200) {
          setArchiveTransactions((prev) => [...prev, res.data.transaction]);
          return;
        }
        console.log({ requestArchivedDocumentFail: res });
      })
      .catch((err) => {
        console.log({ requestArchivedDocumentFail: err });
      });
  };

  return (
    <>
      <div className="px-4 py-2">
        <div className="grid grid-cols-[80%,1fr]">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Title</p>
              <p className="lb-regular ">{archiveDocument?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Serial Number</p>
              <p className="lb-regular">{archiveDocument?.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="lb-regular">{archiveDocument?.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Holder</p>
              <p>
                {archiveDocument?.currentHolder !== null ? (
                  archiveDocument?.currentHolder.name
                ) : (
                  <RxValueNone />
                )}
              </p>
            </div>
            <div></div>
            <div className="col-span-2 text-sm text-gray-600">
              <p className="lb-regular underline text-black text-base">
                Location
              </p>
              <div className="flex flex-row items-center gap-2">
                <MdLocationPin />
                <p>Location Name</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* <MdFolder /> */}
                <p>Rack Label</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* <MdFolder /> */}
                <p>Compartment Label</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* <MdFolder /> */}
                <p>Shelf Label</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                {/* <MdFolder /> */}
                <p>Box Label</p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <button
              className="h-8 w-full rounded-sm bg-[#023e8a] text-white"
              onClick={toggleRequestArchiveDocumentModal}
            >
              <p>Request</p>
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="border rounded-[12px] overflow-hidden w-full">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Requested At</th>
                  <th>HOD</th>
                  <th>Status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {archiveTransactions.map((transaction, idx) => {
                  const {
                    archiveTransactionId,
                    requestedAt,
                    requestApprover,
                    status,
                    comment,
                  } = transaction;
                  return (
                    <tr key={archiveTransactionId}>
                      <td data-cell="#">{idx + 1}</td>
                      <td data-cell="requested at">
                        {new Date(requestedAt).toUTCString()}
                      </td>
                      <td data-cell="HOD">{requestApprover.name}</td>
                      <td data-cell="status">
                        <div
                          className={`rounded-full h-6 w-fit pl-2 pr-4 flex flex-row items-center gap-1 justify-center ${
                            status === "submitted"
                              ? " text-yellow-500 bg-yellow-100"
                              : status === "approved"
                              ? "reen-400 text-green-400 bg-green-100"
                              : status === "rejected"
                              ? " text-red-500 bg-red-100"
                              : " text-blue-500 bg-blue-100"
                          }`}
                        >
                          <PiDotOutlineFill className="text-xl" />
                          <p className="text-xs capitalize">{status}</p>
                        </div>
                      </td>
                      <td data-cell="comment">{comment}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showRequestArchiveDocumentModal ? (
        <RequestArchiveDocument
          toggleModal={toggleRequestArchiveDocumentModal}
          requestForDocument={makeRequestForArchivedDocument}
        />
      ) : undefined}
    </>
  );
}
