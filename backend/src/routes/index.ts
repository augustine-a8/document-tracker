import { Express } from "express";

import { historyEndpoint } from "./history.route";
import { usersEndpoint } from "./user.route";
import { documentEndpoint } from "./document.route";
import { Endpoint } from "../@types/endpoint";

const endpoints: Endpoint[] = [
  historyEndpoint,
  usersEndpoint,
  documentEndpoint,
];

function createRoutes(app: Express) {
  endpoints.forEach((endpoint) => {
    const { path, router } = endpoint;
    app.use(`/api/${path}`, router);
  });
}

export { createRoutes };