import { Router } from "express";
import {
  addActiveDoc,
  forwardActiveDoc,
  getActiveDocById,
  getAllActiveDocs,
  acknowledgeForwardedActiveDocument,
  getActiveDocsPendingAcknowledgements,
  acknowledgeForwardedActiveDocuments,
  returnForwardedActiveDocument,
} from "../controllers/activeDoc.controller";
import {
  addActiveDocSchema,
  forwardActiveDocSchema,
  acknowledgeForwardedActiveDocumentSchema,
  returnActiveDocSchema,
} from "../validations/activeDocs.validation";
import { checkAuthentication } from "../middleware/check-auth";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../lib/async-wrapper";
import { Endpoint } from "../@types/endpoint";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllActiveDocs));
router.post(
  "/",
  checkAuthentication,
  validateRequest(addActiveDocSchema),
  asyncHandler(addActiveDoc)
);
router.post(
  "/:id/forward",
  checkAuthentication,
  validateRequest(forwardActiveDocSchema),
  asyncHandler(forwardActiveDoc)
);
router.post(
  "/:id/acknowledge",
  checkAuthentication,
  asyncHandler(acknowledgeForwardedActiveDocument)
);
router.post(
  "/:id/return",
  checkAuthentication,
  validateRequest(returnActiveDocSchema),
  asyncHandler(returnForwardedActiveDocument)
);
router.post(
  "/acknowledge",
  checkAuthentication,
  validateRequest(acknowledgeForwardedActiveDocumentSchema),
  asyncHandler(acknowledgeForwardedActiveDocuments)
);
router.get(
  "/acknowledge",
  checkAuthentication,
  asyncHandler(getActiveDocsPendingAcknowledgements)
);
router.get("/:id", checkAuthentication, asyncHandler(getActiveDocById));

const activeDocEndpoint: Endpoint = {
  path: "/activeDocs",
  router,
};

export { activeDocEndpoint };
