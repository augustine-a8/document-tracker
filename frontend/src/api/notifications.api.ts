import { AxiosError } from "axios";

import { apiClient } from "./config";

function getUserNotificationsApi() {
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

export { getUserNotificationsApi };
