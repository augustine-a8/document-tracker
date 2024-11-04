import { Request } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export interface IAuthUser {
  userId: string;
  email: string;
  role: string;
}
