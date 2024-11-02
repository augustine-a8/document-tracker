import axios, { AxiosError } from "axios";

import { Config } from "./config";
const { BaseEndpoint } = Config;

function searchUserApi(token: string, searchParam: string) {
  const res = axios
    .post(
      `${BaseEndpoint}/users/search`,
      { searchParam },
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

function getMyAccountApi(token: string) {
  const res = axios
    .get(`${BaseEndpoint}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

export { searchUserApi, getMyAccountApi };
