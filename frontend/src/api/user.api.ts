import axios, { AxiosError } from "axios";

import { Config } from "./config";
const { BaseEndpoint } = Config;

const apiClient = axios.create({
  baseURL: BaseEndpoint,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/auth/refresh-token");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function searchUserApi(searchParam: string) {
  const res = apiClient
    .post("/users/search", { searchParam })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

function getMyAccountApi() {
  const res = apiClient
    .get("/users/me")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

export { searchUserApi, getMyAccountApi };
