import { Router } from "express";

import {
  addToArchive,
  approveRequestForArchiveDocument,
  fulfillRequestForArchiveDocument,
  getAllArchiveDocumentRequestsAwaitingApproval,
  getAllArchiveDocumentRequestsAwaitingFulfillment,
  getAllArchiveDocuments,
  getAllUserArchiveDocumentRequest,
  getArchiveDocumentById,
  requestForArchiveDocument,
  returnArchiveDocument,
} from "../controllers/archive.controller";
import { Endpoint } from "../@types/endpoint";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";
import {
  addToArchiveSchema,
  approveRequestForArchiveDocumentSchema,
  fulfillRequestForArchiveDocumentSchema,
  requestForArchiveDocumentSchema,
  returnArchiveDocumentSchema,
} from "../validations/archive.validation";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post(
  "/",
  checkAuthentication,
  validateRequest(addToArchiveSchema),
  asyncHandler(addToArchive)
);
router.get("/", checkAuthentication, asyncHandler(getAllArchiveDocuments));
router.get(
  "/requests",
  checkAuthentication,
  asyncHandler(getAllUserArchiveDocumentRequest)
);
router.get(
  "/requests/approve",
  checkAuthentication,
  asyncHandler(getAllArchiveDocumentRequestsAwaitingApproval)
);
router.get(
  "/requests/fulfill",
  checkAuthentication,
  asyncHandler(getAllArchiveDocumentRequestsAwaitingFulfillment)
);
router.post(
  "/requests/approve",
  checkAuthentication,
  validateRequest(approveRequestForArchiveDocumentSchema),
  asyncHandler(approveRequestForArchiveDocument)
);
router.post(
  "/requests/fulfill",
  checkAuthentication,
  validateRequest(fulfillRequestForArchiveDocumentSchema),
  asyncHandler(fulfillRequestForArchiveDocument)
);
router.get("/:id", checkAuthentication, asyncHandler(getArchiveDocumentById));
router.post(
  "/requests/:id",
  checkAuthentication,
  validateRequest(requestForArchiveDocumentSchema),
  asyncHandler(requestForArchiveDocument)
);
router.post(
  "/:id/return",
  checkAuthentication,
  validateRequest(returnArchiveDocumentSchema),
  asyncHandler(returnArchiveDocument)
);

const archiveEndpoint: Endpoint = {
  path: "/archives",
  router,
};

export { archiveEndpoint };
