import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import { getCustodyHistoryForDocument } from "../controllers/history.controller";
import { asyncHandler } from "../lib/async-wrapper";

const router = Router();

router.get("/", asyncHandler(getCustodyHistoryForDocument));

const historyEndpoint: Endpoint = { path: "/documents/:id/history", router };

export { historyEndpoint };
