import axios, { AxiosError } from "axios";

import { Config } from "./config";

const { BaseEndpoint } = Config;

function loginApi(email: string, password: string) {
  const res = axios
    .post(`${BaseEndpoint}/auth/login`, {
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
    .post(`${BaseEndpoint}/auth/register`, {
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

export { loginApi, registerApi };
