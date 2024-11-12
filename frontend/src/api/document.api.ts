import { AxiosError } from "axios";

import { INewDocument } from "../@types/document";
import { apiClient } from "./config";

function getAllDocumentsApi() {
  const res = apiClient
    .get("/documents")
    .then((res) => {
      return {
        data: res.data,
        status: res.status,
      };
    })
    .catch((err: AxiosError) => {
      return {
        status: err.response?.status,
        data: err.response?.data,
      };
    });

  return res;
}

function addDocumentApi(newDocument: INewDocument) {
  const res = apiClient
    .post("/documents", { ...newDocument })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });
  return res;
}

function getDocumentByIdApi(documentId: string) {
  const res = apiClient
    .get(`/documents/${documentId}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return {
        status: err.response?.status,
        data: err.response?.data,
      };
    });
  return res;
}

function sendDocumentApi(
  documentId: string,
  receiverId: string,
  comment: string
) {
  const res = apiClient
    .post(`/documents/${documentId}/send`, { receiverId, comment })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function returnDocumentApi(
  documentId: string,
  historyId: string,
  notificationId: string,
  comment: string
) {
  const res = apiClient
    .post(`/documents/${documentId}/return`, {
      historyId,
      notificationId,
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

export {
  getAllDocumentsApi,
  addDocumentApi,
  getDocumentByIdApi,
  sendDocumentApi,
  returnDocumentApi,
};
