import { Router } from "express";

import { Endpoint } from "../@types/endpoint";

const router = Router();

router.get("/", () => {});
router.post("/", () => {});

const usersEndpoint: Endpoint = { path: "/users", router };

export { usersEndpoint };
