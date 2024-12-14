import { AxiosError } from "axios";
import { apiClient } from "./config";
import { INewArchive } from "../@types/archive";

async function addToArchiveApi(newArchive: INewArchive) {
  const res = apiClient
    .post("/archives/", { ...newArchive })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getAllArchiveDocumentsApi(
  start: number,
  limit: number,
  search: string
) {
  const res = apiClient
    .get(`/archives/?start=${start}&limit=${limit}&search=${search}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getAllUserArchiveDocumentRequestApi(
  start: number,
  limit: number,
  search: string
) {
  const res = apiClient
    .get(`/archives/requests/?start=${start}&limit=${limit}&search=${search}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getAllArchiveDocumentRequestsAwaitingApprovalApi(
  start: number,
  limit: number,
  search: string
) {
  const res = apiClient
    .get(
      `/archives/requests/approve/?start=${start}&limit=${limit}&search=${search}`
    )
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getAllArchiveDocumentRequestsAwaitingFulfillmentApi(
  start: number,
  limit: number,
  search: string
) {
  const res = apiClient
    .get(
      `/archives/requests/fulfill/?start=${start}&limit=${limit}&search=${search}`
    )
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getArchiveDocumentByIdApi(id: string) {
  const res = apiClient
    .get(`/archives/${id}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function requestForArchiveDocumentApi(id: string, department: string) {
  const res = apiClient
    .post(`/archives/requests/${id}`, { department })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function approveRequestForArchiveDocumentApi(transactionIds: string[]) {
  const res = apiClient
    .post(`/archives/requests/approve`, { transactionIds })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function fulfillRequestForArchiveDocumentApi(transactionIds: string[]) {
  const res = apiClient
    .post("/archives/requests/fulfill", {
      transactionIds,
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

export {
  addToArchiveApi,
  approveRequestForArchiveDocumentApi,
  fulfillRequestForArchiveDocumentApi,
  getAllArchiveDocumentRequestsAwaitingApprovalApi,
  getAllArchiveDocumentRequestsAwaitingFulfillmentApi,
  getAllArchiveDocumentsApi,
  getAllUserArchiveDocumentRequestApi,
  getArchiveDocumentByIdApi,
  requestForArchiveDocumentApi,
};
