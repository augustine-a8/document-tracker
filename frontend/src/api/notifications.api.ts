import { AxiosError } from "axios";

import { apiClient } from "./config";

async function getAllNotificationsApi() {
  const res = apiClient
    .get("/notifications")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function readUserNotificationsApi(notifications: string[]) {
  const res = apiClient
    .post("/notifications/read", { notifications })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

export { getAllNotificationsApi, readUserNotificationsApi };
