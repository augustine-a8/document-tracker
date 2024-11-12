import { AxiosError } from "axios";

import { apiClient } from "./config";

function getAllCustodyHistoryApi() {
  const res = apiClient
    .get("/history")
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

function getHistoryForDocumentApi(documentId: string) {
  const res = apiClient
    .get(`/history/${documentId}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });
  return res;
}

function acknowledgeDocumentApi(historyId: string, notificationId: string) {
  const res = apiClient
    .post(`/history/${historyId}/acknowledge`, {
      notificationId,
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function acknowledgeMultipleDocumentsApi(
  acknowledgements: { historyId: string; notificationId: string }[]
) {
  const res = apiClient
    .post("/history/acknowledge", {
      acknowledgements,
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
  getAllCustodyHistoryApi,
  getHistoryForDocumentApi,
  acknowledgeDocumentApi,
  acknowledgeMultipleDocumentsApi,
};
