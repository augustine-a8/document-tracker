import { Router } from "express";

import { Endpoint } from "../@types/endpoint";

const router = Router();

router.get("/", () => {});

const historyEndpoint: Endpoint = { path: "/documents/{id}/history", router };

export { historyEndpoint };
