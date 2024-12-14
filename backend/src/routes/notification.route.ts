import { Router } from "express";

import { checkAuthentication } from "../middleware/check-auth";
import {
  getAllNotifications,
  readUserNotifications,
} from "../controllers/notification.controller";
import { Endpoint } from "../@types/endpoint";
import { asyncHandler } from "../lib/async-wrapper";
import { validateRequest } from "../middleware/validateRequest";
import { readUserNotificationsSchema } from "../validations/notifications.validation";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllNotifications));
router.post(
  "/read",
  checkAuthentication,
  validateRequest(readUserNotificationsSchema),
  asyncHandler(readUserNotifications)
);

const notificationEndpoint: Endpoint = { path: "/notifications", router };

export { notificationEndpoint };
