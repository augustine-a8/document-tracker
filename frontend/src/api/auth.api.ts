import axios, { AxiosError } from "axios";

import { Config } from "./config";

const { BaseEndpoint } = Config;

axios.defaults.baseURL = BaseEndpoint;
axios.defaults.withCredentials = true;

function loginApi(email: string, password: string) {
  const res = axios
    .post("/auth/login", {
      email,
      password,
    })
    .then((res) => {
      return {
        status: res.status,
        data: res.data,
      };
    })
    .catch((err: AxiosError) => {
      return {
        status: err.response?.status,
        data: err.response?.data,
      };
    });

  return res;
}

async function registerApi(email: string, name: string, password: string) {
  const res = axios
    .post("/auth/register", {
      email,
      name,
      password,
    })
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

async function logoutApi() {
  const res = axios
    .post("/auth/logout")
    .then((res) => {
      return { status: res.status, data: res.data };
    })
    .catch((err: AxiosError) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  return res;
}

export { loginApi, registerApi, logoutApi };
