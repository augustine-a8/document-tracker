import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {
  acknowledgeDocument,
  acknowledgeMultipleDocuments,
  getAllTransactions,
  getTransactionsForDocument,
} from "../controllers/transaction.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllTransactions));
router.get(
  "/:id",
  checkAuthentication,
  asyncHandler(getTransactionsForDocument)
);
router.post("/:id/acknowledge", checkAuthentication, acknowledgeDocument);
router.post("/acknowledge", checkAuthentication, acknowledgeMultipleDocuments);

const transactionEndpoint: Endpoint = { path: "/transactions", router };

export { transactionEndpoint };
