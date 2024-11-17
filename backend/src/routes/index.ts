import { Express } from "express";

import { Endpoint } from "../@types/endpoint";
import { transactionEndpoint } from "./transaction.route";
import { usersEndpoint } from "./user.route";
import { documentEndpoint } from "./document.route";
import { authEndpoint } from "./auth.route";
import { notificationEndpoint } from "./notification.route";
import { archiveEndpoint } from "./archive.route";

const endpoints: Endpoint[] = [
  transactionEndpoint,
  usersEndpoint,
  documentEndpoint,
  authEndpoint,
  notificationEndpoint,
  archiveEndpoint,
];

function createRoutes(app: Express) {
  endpoints.forEach((endpoint) => {
    const { path, router } = endpoint;
    app.use(`/api${path}`, router);
  });
}

export { createRoutes };
