import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import { addUser, getAllUsers } from "../controllers/user.controller";
import { asyncHandler } from "../lib/async-wrapper";

const router = Router();

router.get("/", asyncHandler(getAllUsers));
router.post("/", asyncHandler(addUser));

const usersEndpoint: Endpoint = { path: "/users", router };

export { usersEndpoint };
