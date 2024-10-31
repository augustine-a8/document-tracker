import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {
  getAllDocuments,
  addDocument,
  getDocumentById,
  updateDocument,
  transferDocumentCustody,
} from "../controllers/document.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllDocuments));
router.get("/:id", checkAuthentication, asyncHandler(getDocumentById));
router.post("/", checkAuthentication, asyncHandler(addDocument));
router.patch("/:id", checkAuthentication, asyncHandler(updateDocument));
router.post(
  "/:id/transfer",
  checkAuthentication,
  asyncHandler(transferDocumentCustody)
);

const documentEndpoint: Endpoint = { path: "/document", router };

export { documentEndpoint };
