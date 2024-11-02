import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {
  getAllDocuments,
  addDocument,
  getDocumentById,
  sendDocument,
  acknowledgeDocument,
} from "../controllers/document.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";
import { getCustodyHistoryForDocument } from "../controllers/history.controller";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllDocuments));
router.get("/:id", checkAuthentication, asyncHandler(getDocumentById));
router.get(
  "/:id/history",
  checkAuthentication,
  asyncHandler(getCustodyHistoryForDocument)
);
router.post("/", checkAuthentication, asyncHandler(addDocument));
// router.patch("/:id", checkAuthentication, asyncHandler(updateDocument));
router.post("/:id/send", checkAuthentication, asyncHandler(sendDocument));

const documentEndpoint: Endpoint = { path: "/documents", router };

export { documentEndpoint };
