import { AxiosError } from "axios";
import { apiClient } from "./config";
import { INewActiveDoc } from "../@types/activeDoc";

async function getAllActiveDocsApi(
  start: number,
  limit: number,
  search: string
) {
  const res = apiClient
    .get(`/newActiveDocs/?start=${start}&limit=${limit}&search=${search}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getActiveDocByIdApi(id: string) {
  const res = apiClient
    .get(`/newActiveDocs/${id}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function addActiveDocApi(newActiveDoc: INewActiveDoc) {
  const res = apiClient
    .post("/newActiveDocs/", {
      ...newActiveDoc,
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function forwardActiveDocApi(
  id: string,
  forwardToId: string,
  comment: string
) {
  const res = apiClient
    .post(`/newActiveDocs/${id}/forward`, { forwardToId, comment })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function getActiveDocsPendingAcknowledgementsApi(
  start: number,
  limit: number,
  search: string
) {
  const res = apiClient
    .get(
      `/newActiveDocs/pending/?start=${start}&limit=${limit}&search=${search}`
    )
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function acknowledgeActiveDocumentApi(
  transactionAcknowledgements: {
    sentTransactionId: string;
    stateHistoryId: string;
  }[]
) {
  const res = apiClient
    .post(`/newActiveDocs/acknowledge`, { transactionAcknowledgements })
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

async function returnActiveDocumentApi(transactionReturned: {
  sentTransactionId: string;
  stateHistoryId: string;
}) {
  const res = apiClient
    .post(`/newActiveDocs/return`, { transactionReturned })
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

export {
  addActiveDocApi,
  forwardActiveDocApi,
  getActiveDocByIdApi,
  getAllActiveDocsApi,
  getActiveDocsPendingAcknowledgementsApi,
  returnActiveDocumentApi,
  acknowledgeActiveDocumentApi,
};
