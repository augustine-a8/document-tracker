import jwt from "jsonwebtoken";
import { Config } from "../config";

const { accessTokenSecret, refreshTokenSecret } = Config;

function generateToken(userId: string, email: string, role: string) {
  const payload = { userId, email, role };
  const options = { expiresIn: "2h" };

  return jwt.sign(payload, accessTokenSecret as string, options);
}

function generateRefreshToken(userId: string, email: string, role: string) {
  const payload = { userId, email, role };
  const options = { expiresIn: "1d" };

  return jwt.sign(payload, refreshTokenSecret as string, options);
}

export { generateToken, generateRefreshToken };
