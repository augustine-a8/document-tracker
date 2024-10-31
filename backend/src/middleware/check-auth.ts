import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../@types/authRequest";
import { Config } from "../config";

const { jwtSecret } = Config;

function checkAuthentication(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Access Denied: No token provided" });
    next();
    return;
  }

  jwt.verify(token, jwtSecret as string, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Access Denied: Invalid token" });
    }

    req.user = user;
    next();
  });
}

export { checkAuthentication };
