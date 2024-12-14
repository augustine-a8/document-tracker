import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import {
  acknowledgeForwardedActiveDocumentSchema,
  addActiveDocSchema,
  forwardActiveDocSchema,
  returnActiveDocSchema,
} from "../validations/activeDocs.validation";
import {
  acknowledgeMultipleDocs,
  addNewDoc,
  forwardDoc,
  getAllDocs,
  getDocById,
  getPendingAcknowledgements,
  returnDoc,
} from "../controllers/activeDoc.new.controller";
import { checkAuthentication } from "../middleware/check-auth";
import { asyncHandler } from "../lib/async-wrapper";
import { Endpoint } from "../@types/endpoint";

const router = Router();

router.post(
  "/",
  checkAuthentication,
  validateRequest(addActiveDocSchema),
  asyncHandler(addNewDoc)
);
router.post(
  "/:id/forward",
  checkAuthentication,
  validateRequest(forwardActiveDocSchema),
  asyncHandler(forwardDoc)
);
router.post(
  "/acknowledge",
  checkAuthentication,
  validateRequest(acknowledgeForwardedActiveDocumentSchema),
  asyncHandler(acknowledgeMultipleDocs)
);
router.post(
  "/return",
  checkAuthentication,
  validateRequest(returnActiveDocSchema),
  asyncHandler(returnDoc)
);
router.get("/", checkAuthentication, asyncHandler(getAllDocs));
router.get(
  "/pending",
  checkAuthentication,
  asyncHandler(getPendingAcknowledgements)
);
router.get("/:id", checkAuthentication, asyncHandler(getDocById));

const newActiveDocEndpoint: Endpoint = {
  path: "/newActiveDocs",
  router,
};

export { newActiveDocEndpoint };
