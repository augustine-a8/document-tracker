import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {
  acknowledgeDocument,
  acknowledgeMultipleDocuments,
  getAllCustodyHistory,
  getCustodyHistoryForDocument,
} from "../controllers/history.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllCustodyHistory));
router.get(
  "/:id",
  checkAuthentication,
  asyncHandler(getCustodyHistoryForDocument)
);
router.post("/:id/acknowledge", checkAuthentication, acknowledgeDocument);
router.post("/acknowledge", checkAuthentication, acknowledgeMultipleDocuments);

const historyEndpoint: Endpoint = { path: "/history", router };

export { historyEndpoint };
