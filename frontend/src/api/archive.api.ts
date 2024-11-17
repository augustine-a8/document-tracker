import { AxiosError } from "axios";
import { apiClient } from "./config";

async function getAllArchivedDocumentsApi() {
  const res = apiClient
    .get("/archives/")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getArchivedDocumentByIdApi(archiveDocumentId: string) {
  const res = apiClient
    .get(`archives/${archiveDocumentId}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function requestForArchivedDocumentApi(
  archiveDocumentId: string,
  requestApproverId: string,
  comment: string
) {
  const res = apiClient
    .post(`archives/requests/${archiveDocumentId}`, {
      requestApproverId,
      comment,
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getAllArchiveRequestsApi() {
  const res = apiClient
    .get("archives/requests")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getAllUserRequestsForDocumentApi(documentId: string) {
  const res = apiClient
    .get(`archives/requests/${documentId}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getRequestsPendingHODApprovalApi() {
  const res = apiClient
    .get("/archives/requests/hod")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getApprovedRequestsPendingAcceptanceApi() {
  const res = apiClient
    .get("/archives/requests/archiver")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

// For HOD
async function approveRequestForArchiveDocumentApi(
  transactionId: string,
  approveRequest: boolean
) {
  const res = apiClient
    .post(`/archives/requests/${transactionId}/approve`, { approveRequest })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

export {
  getAllArchivedDocumentsApi,
  getArchivedDocumentByIdApi,
  requestForArchivedDocumentApi,
  getAllArchiveRequestsApi,
  getAllUserRequestsForDocumentApi,
  getRequestsPendingHODApprovalApi,
  getApprovedRequestsPendingAcceptanceApi,
  approveRequestForArchiveDocumentApi,
};
