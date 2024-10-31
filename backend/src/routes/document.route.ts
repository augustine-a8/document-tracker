import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import { getAllDocuments, addDocument, getDocumentById, updateDocument } from "../controllers/document.controller";

const router = Router();

router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.post("/", addDocument);
router.patch("/:id", updateDocument);

const documentEndpoint: Endpoint = { path: "/document", router };

export { documentEndpoint };
