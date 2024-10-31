import jwt from "jsonwebtoken";
import { Config } from "../config";

const { jwtSecret } = Config;

function generateToken(userId: string, email: string, role: string) {
  const payload = { userId, email, role };
  const options = { expiresIn: "1d" };

  return jwt.sign(payload, jwtSecret as string, options);
}

export { generateToken };
