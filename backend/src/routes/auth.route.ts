import { Router } from "express";

import { asyncHandler } from "../lib/async-wrapper";
import { Endpoint } from "../@types/endpoint";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post("/login", validateRequest(loginSchema), asyncHandler(login));
router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(register)
);
router.post("/logout", asyncHandler(logout));
router.post("/refresh-token", asyncHandler(refreshToken));

const authEndpoint: Endpoint = { path: "/auth", router };

export { authEndpoint };
