import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

import {
  getArchiveDocumentByIdApi,
  requestForArchiveDocumentApi,
} from "../../api/archive.api";
import { IArchive } from "../../@types/archive";
import RequestArchiveDocument from "./RequestArchiveDocument";
import { useAuth } from "../../hooks/useAuth";
import { IError } from "../../@types/error";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import EmptyPage from "../../components/EmptyPage";

export default function ArchiveDetails() {
  const [archive, setArchive] = useState<IArchive | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<IError | null>(null);
  const [showRequestArchiveDocumentModal, setShowRequestArchiveDocumentModal] =
    useState<boolean>(false);
  const { archiveId } = useParams();
  const navigate = useNavigate();
  const { getMyAccount } = useAuth();

  const myAccount = getMyAccount();

  useEffect(() => {
    const fetchArchiveDocumentById = () => {
      setApiLoading(true);
      getArchiveDocumentByIdApi(archiveId!)
        .then((res) => {
          if (res.status === 200) {
            setArchive(res.data.archive);
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

    fetchArchiveDocumentById();
  }, []);

  const toggleRequestArchiveDocumentModal = () => {
    setShowRequestArchiveDocumentModal((prev) => !prev);
  };

  const goBack = () => {
    navigate("/archives/");
  };

  const requestForArchiveDocument = (department: string) => {
    if (archive === null) {
      return;
    }
    requestForArchiveDocumentApi(archive.archiveId, department)
      .then((res) => {
        if (res.status === 200) {
          const archiveTransactions = archive!.transactions;
          const newArchive: IArchive = {
            ...archive,
            transactions: archiveTransactions,
          };
          archiveTransactions.push(res.data.transaction);
          setArchive(newArchive);
          toggleRequestArchiveDocumentModal();
          return;
        }
        console.log({ requestArchivedDocumentFail: res });
      })
      .catch((err) => {
        console.log({ requestArchivedDocumentFail: err });
      });
  };

  if (archive == null) {
    return;
  }

  return (
    <>
      <div className="w-full px-4 mt-2" onClick={goBack}>
        <button className="w-fit flex flex-row gap-2 items-center text-sm text-[#023e8a] hover:underline">
          <MdOutlineArrowBackIosNew />
          <p>Back</p>
        </button>
      </div>
      {apiLoading ? (
        <LoadingPage />
      ) : apiError !== null ? (
        <ErrorPage message={apiError.data.message} />
      ) : (
        <div className="px-4 py-2">
          <div className="grid grid-cols-[80%,1fr]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Archival number</p>
                <p className="lb-regular">{archive?.archivalNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Item number</p>
                <p className="lb-regular ">{archive?.itemNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="lb-regular">{archive?.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Covering date</p>
                <p className="lb-regular">{archive?.coveringDate}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">File number</p>
                <p className="lb-regular">{archive?.fileNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remarks</p>
                <p className="lb-regular">{archive?.remarks}</p>
              </div>
            </div>
            <div className="grid place-items-center">
              {myAccount?.role !== "archiver" ? (
                <div className="w-full">
                  <button
                    className="h-8 w-full rounded-sm bg-[#023e8a] text-white hover:opacity-80 duration-300"
                    onClick={toggleRequestArchiveDocumentModal}
                  >
                    <p>Request</p>
                  </button>
                </div>
              ) : undefined}
            </div>
          </div>
          {archive.transactions.length > 0 ? (
            <div className="mt-4">
              <div className="border rounded-[12px] overflow-hidden w-full">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Requested By</th>
                      <th>Department</th>
                      <th>Requested At</th>
                      <th>Retrieved By</th>
                      <th>Date Produced</th>
                      <th>Remarks</th>
                      <th>Date Returned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archive?.transactions.map((transaction, idx) => {
                      const {
                        transactionId,
                        requestedAt,
                        requestedBy,
                        department,
                        retrievedBy,
                        dateProduced,
                        remarks,
                        dateReturned,
                      } = transaction;
                      return (
                        <tr key={transactionId}>
                          <td data-cell="#">{idx + 1}</td>
                          <td data-cell="requested by">{requestedBy.name}</td>
                          <td data-cell="department">{department}</td>
                          <td data-cell="requested at">
                            {new Date(requestedAt).toUTCString()}
                          </td>
                          <td data-cell="retrieved by">
                            {retrievedBy ? retrievedBy : "-"}
                          </td>
                          <td data-cell="date produced">
                            {dateProduced !== null
                              ? new Date(dateProduced).toUTCString()
                              : "-"}
                          </td>
                          <td data-cell="remarks">{remarks ? remarks : "-"}</td>
                          <td data-cell="date returned">
                            {dateReturned !== null
                              ? new Date(dateReturned).toUTCString()
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyPage message="No transaction for archive document!" />
          )}
        </div>
      )}
      {showRequestArchiveDocumentModal ? (
        <RequestArchiveDocument
          toggleModal={toggleRequestArchiveDocumentModal}
          requestForDocument={requestForArchiveDocument}
        />
      ) : undefined}
    </>
  );
}
