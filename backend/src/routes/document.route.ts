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

const router = Router();

router.get("/", asyncHandler(getAllDocuments));
router.get("/:id", asyncHandler(getDocumentById));
router.post("/", asyncHandler(addDocument));
router.patch("/:id", asyncHandler(updateDocument));
router.post("/:id/transfer", asyncHandler(transferDocumentCustody));

const documentEndpoint: Endpoint = { path: "/document", router };

export { documentEndpoint };
