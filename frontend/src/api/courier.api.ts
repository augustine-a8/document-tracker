import { AxiosError } from "axios";
import { apiClient } from "./config";

function getAllMailsApi(
  mailStatus: "pending" | "transit" | "delivered" | "" = "",
  start: number,
  limit: number,
  search: string,
  date: string
) {
  const res = apiClient
    .get(
      `/mails/${mailStatus}/?start=${start}&limit=${limit}&search=${search}&date=${date}`
    )
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function addMailApi(referenceNumber: string, addressee: string) {
  const res = apiClient
    .post("/mails", { referenceNumber, addressee })
    .then((res) => {
      console.log({ res });
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      console.log({ err });
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function getMailByIdApi(mailId: string) {
  const res = apiClient
    .get(`/mails/${mailId}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function findDriverByNameApi(search: string) {
  const res = apiClient
    .post("/mails/drivers/search", { search })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function addNewDriverApi(name: string, contact: string) {
  const res = apiClient
    .post("/mails/drivers", { name, contact })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function dispatchMailApi(driverId: string, mailIds: string[]) {
  const res = apiClient
    .post(`mails/dispatch/${driverId}`, { mailIds })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function getAllDriversApi(start: number, limit: number, search: string) {
  const res = apiClient
    .get(`mails/drivers/?start=${start}&limit=${limit}&search=${search}`)
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function getDriverByIdApi(driverId: string | undefined) {
  const res = apiClient
    .get(`mails/drivers/${driverId}`)
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

function getMailsForDriverApi(
  driverId: string | undefined,
  start: number,
  limit: number,
  search: string,
  date: string
) {
  const res = apiClient
    .get(
      `mails/drivers/${driverId}/deliveries/?start=${start}&limit=${limit}&search=${search}&date=${date}`
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
  getAllMailsApi,
  addMailApi,
  getMailByIdApi,
  findDriverByNameApi,
  addNewDriverApi,
  dispatchMailApi,
  getAllDriversApi,
  getMailsForDriverApi,
  getDriverByIdApi,
};
