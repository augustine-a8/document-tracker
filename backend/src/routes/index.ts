import { Express } from "express";

import { Endpoint } from "../@types/endpoint";
import { usersEndpoint } from "./user.route";
import { authEndpoint } from "./auth.route";
import { notificationEndpoint } from "./notification.route";
import { archiveEndpoint } from "./archive.route";
import { mailEndpoint } from "./mail.route";
import { activeDocEndpoint } from "./activeDoc.route";
import { newActiveDocEndpoint } from "./activeDoc.new.route";

const endpoints: Endpoint[] = [
  usersEndpoint,
  authEndpoint,
  activeDocEndpoint,
  newActiveDocEndpoint,
  archiveEndpoint,
  mailEndpoint,
  notificationEndpoint,
];

function createRoutes(app: Express) {
  endpoints.forEach((endpoint) => {
    const { path, router } = endpoint;
    app.use(`/api${path}`, router);
  });
}

export { createRoutes };
