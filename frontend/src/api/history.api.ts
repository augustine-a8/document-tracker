import axios, { AxiosError } from "axios";

import { Config } from "./config";

const { BaseEndpoint } = Config;

function getAllCustodyHistoryApi(token: string) {
  const res = axios
    .get(`${BaseEndpoint}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

function getHistoryForDocumentApi(token: string, documentId: string) {
  const res = axios
    .get(`${BaseEndpoint}/history/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });
  return res;
}

function acknowledgeDocumentApi(
  token: string,
  historyId: string,
  notificationId: string
) {
  const res = axios
    .post(
      `${BaseEndpoint}/history/${historyId}/acknowledge`,
      {
        notificationId,
      },
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

function acknowledgeMultipleDocumentsApi(
  token: string,
  acknowledgements: { historyId: string; notificationId: string }[]
) {
  const res = axios
    .post(
      `${BaseEndpoint}/history/acknowledge`,
      {
        acknowledgements,
      },
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

export {
  getAllCustodyHistoryApi,
  getHistoryForDocumentApi,
  acknowledgeDocumentApi,
  acknowledgeMultipleDocumentsApi,
};
