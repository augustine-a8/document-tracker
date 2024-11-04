import { Router } from "express";

import { checkAuthentication } from "../middleware/check-auth";
import { getUserNotifications } from "../controllers/notification.controller";
import { Endpoint } from "../@types/endpoint";

const router = Router();

router.get("/", checkAuthentication, getUserNotifications);

const notificationEndpoint: Endpoint = { path: "/notifications", router };

export { notificationEndpoint };
