import { Express } from "express";

import { historyEndpoint } from "./history.route";
import { usersEndpoint } from "./user.route";
import { documentEndpoint } from "./document.route";
import { authEndpoint } from "./auth.route";
import { Endpoint } from "../@types/endpoint";
import { notificationEndpoint } from "./notification.route";

const endpoints: Endpoint[] = [
  historyEndpoint,
  usersEndpoint,
  documentEndpoint,
  authEndpoint,
  notificationEndpoint,
];

function createRoutes(app: Express) {
  endpoints.forEach((endpoint) => {
    const { path, router } = endpoint;
    app.use(`/api${path}`, router);
  });
}

export { createRoutes };
