import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {
  addUser,
  getAllUsers,
  getMyAccount,
  searchUserByNameOrEmail,
} from "../controllers/user.controller";
import { asyncHandler } from "../lib/async-wrapper";
import { checkAuthentication } from "../middleware/check-auth";

const router = Router();

router.get("/", asyncHandler(getAllUsers));
router.get("/me", checkAuthentication, asyncHandler(getMyAccount));
router.post(
  "/search",
  checkAuthentication,
  asyncHandler(searchUserByNameOrEmail)
);
router.post("/", asyncHandler(addUser));

const usersEndpoint: Endpoint = { path: "/users", router };

export { usersEndpoint };
