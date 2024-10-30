import { Router } from "express";

import { Endpoint } from "../@types/endpoint";

const router = Router();

router.get("/", () => {});
router.get("/{id}", () => {});
router.post("/", () => {});
router.patch("/{id}", () => {});

const documentEndpoint: Endpoint = { path: "/document", router };

export { documentEndpoint };
