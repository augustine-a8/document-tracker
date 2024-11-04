import axios, { AxiosError } from "axios";

import { Config } from "./config";

const { BaseEndpoint } = Config;

function getUserNotificationsApi(token: string) {
  const res = axios
    .get(`${BaseEndpoint}/notifications`, {
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

export { getUserNotificationsApi };
