import axios from "axios";

const Config = {
  BaseEndpoint: "http://localhost:9000/api",
  ServerEndpoint: "http://localhost:9000",
};

const { BaseEndpoint } = Config;

const apiClient = axios.create({
  baseURL: BaseEndpoint,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Attempting to refresh tokens");

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      console.log("Refreshing tokens");
      originalRequest._retry = true;

      try {
        await apiClient.post("/auth/refresh-token");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    console.log("Not refreshing tokens");

    return Promise.reject(error);
  }
);

export { apiClient, Config };
