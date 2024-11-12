import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {
  getAllDocuments,
  addDocument,
  getDocumentById,
  sendDocument,
  returnDocument,
} from "../controllers/document.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";
import { getTransactionsForDocument } from "../controllers/transaction.controller";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllDocuments));
router.get("/:id", checkAuthentication, asyncHandler(getDocumentById));
router.get(
  "/:id/transaction",
  checkAuthentication,
  asyncHandler(getTransactionsForDocument)
);
router.post("/", checkAuthentication, asyncHandler(addDocument));
// router.patch("/:id", checkAuthentication, asyncHandler(updateDocument));
router.post("/:id/send", checkAuthentication, asyncHandler(sendDocument));
router.post("/:id/return", checkAuthentication, asyncHandler(returnDocument));

const documentEndpoint: Endpoint = { path: "/documents", router };

export { documentEndpoint };
