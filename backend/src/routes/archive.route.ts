import { Router } from "express";

import {
  acceptRequestForArchivedDocument,
  approveRequestForArchivedDocument,
  getAllArchivedDocumentRequest,
  getAllArchivedDocuments,
  getArchivedDocumentById,
  requestForArchivedDocument,
  addArchivedDocument,
  getAllUserRequestsForDocument,
  getApprovedRequestsPendingArchiverAcceptance,
  getRequestsPendingHODApproval,
} from "../controllers/archive.controller";
import { Endpoint } from "../@types/endpoint";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";

const router = Router();

router.post("/", checkAuthentication, addArchivedDocument);
router.get("/", checkAuthentication, asyncHandler(getAllArchivedDocuments));
router.get(
  "/requests",
  checkAuthentication,
  asyncHandler(getAllArchivedDocumentRequest)
);
router.get(
  "/requests/hod",
  checkAuthentication,
  asyncHandler(getRequestsPendingHODApproval)
);
router.get(
  "/requests/archiver",
  checkAuthentication,
  asyncHandler(getApprovedRequestsPendingArchiverAcceptance)
);
router.get("/:id", checkAuthentication, asyncHandler(getArchivedDocumentById));
router.post(
  "/requests/:id",
  checkAuthentication,
  asyncHandler(requestForArchivedDocument)
);
router.get(
  "/requests/:id",
  checkAuthentication,
  asyncHandler(getAllUserRequestsForDocument)
);
router.post(
  "/requests/:id/approve",
  checkAuthentication,
  asyncHandler(approveRequestForArchivedDocument)
);
router.post(
  "/requests/accept",
  checkAuthentication,
  asyncHandler(acceptRequestForArchivedDocument)
);

const archiveEndpoint: Endpoint = {
  path: "/archives",
  router,
};

export { archiveEndpoint };
