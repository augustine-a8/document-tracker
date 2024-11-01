import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import { getAllCustodyHistory } from "../controllers/history.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";

const router = Router();

router.get("/", checkAuthentication, asyncHandler(getAllCustodyHistory));

const historyEndpoint: Endpoint = { path: "/history", router };

export { historyEndpoint };
