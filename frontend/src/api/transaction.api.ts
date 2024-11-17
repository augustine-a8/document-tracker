import { AxiosError } from "axios";

import { apiClient } from "./config";

function getAllTransactions() {
  const res = apiClient
    .get("/transactions")
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

function getTransactionsForDocumentApi(documentId: string) {
  const res = apiClient
    .get(`/transactions/${documentId}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });
  return res;
}

function acknowledgeDocumentApi(transactionId: string, notificationId: string) {
  const res = apiClient
    .post(`/transactions/${transactionId}/acknowledge`, {
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
  acknowledgements: { transactionId: string; notificationId: string }[]
) {
  const res = apiClient
    .post("/transactions/acknowledge", {
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
  getAllTransactions,
  getTransactionsForDocumentApi,
  acknowledgeDocumentApi,
  acknowledgeMultipleDocumentsApi,
};
