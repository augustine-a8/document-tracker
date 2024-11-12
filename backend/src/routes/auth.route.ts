import { Router } from "express";

import { asyncHandler } from "../lib/async-wrapper";
import { Endpoint } from "../@types/endpoint";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));
router.post("/logout", asyncHandler(logout));
router.post("/refresh-token", asyncHandler(refreshToken));

const authEndpoint: Endpoint = { path: "/auth", router };

export { authEndpoint };
