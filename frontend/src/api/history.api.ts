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

export { getAllCustodyHistoryApi, getHistoryForDocumentApi };
