import axios, { AxiosError } from "axios";

import { Config } from "./config";
import { INewDocument } from "../@types/document";

const { BaseEndpoint } = Config;

function getAllDocumentsApi(token: string) {
  const res = axios
    .get(`${BaseEndpoint}/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

function addDocumentApi(token: string, newDocument: INewDocument) {
  const res = axios
    .post(
      `${BaseEndpoint}/documents`,
      { ...newDocument },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });
  return res;
}

function getDocumentByIdApi(documentId: string, token: string) {
  const res = axios
    .get(`${BaseEndpoint}/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
  token: string,
  documentId: string,
  receiverId: string,
  comment: string
) {
  const res = axios
    .post(
      `${BaseEndpoint}/documents/${documentId}/send`,
      { receiverId, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function returnDocumentApi(
  token: string,
  documentId: string,
  historyId: string,
  notificationId: string,
  comment: string
) {
  const res = axios
    .post(
      `${BaseEndpoint}/documents/${documentId}/return`,
      { historyId, notificationId, comment },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
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
