import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { hashPassword, verifyPassword } from "../lib/password";
import { generateToken } from "../lib/jwt";

const UserRepository = AppDataSource.getRepository(User);

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({
      message: "Email must be provided",
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      message: "Password must be provided",
    });
    return;
  }

  const user = await UserRepository.findOneBy({ email });
  if (!user) {
    res.status(404).json({
      message: "User with email provided not found",
    });
    return;
  }

  if (!verifyPassword(password, user.password)) {
    res.status(403).json({
      message: "Incorrect password",
    });
    return;
  }

  const token = generateToken(user.user_id, user.email, user.role);
  res.status(200).json({
    message: "Login successful",
    token,
  });
}

async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!email) {
    res.status(400).json({
      message: "Email must be provided",
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      message: "Password must be provided",
    });
    return;
  }
  if (!name) {
    res.status(400).json({
      message: "Name must be provided",
    });
    return;
  }

  const existingUser = await UserRepository.findOneBy({ email });
  if (existingUser) {
    res.status(400).json({
      message: "User with email already exists",
    });
    return;
  }

  const user = new User();
  user.user_id = uuidv4();
  user.name = name;
  user.email = email;
  user.password = hashPassword(password);
  user.role = "user";

  const savedUser = await UserRepository.save(user);
  const token = generateToken(
    savedUser.user_id,
    savedUser.email,
    savedUser.role
  );

  res.status(200).json({
    message: "Registration successful",
    token,
  });
}

export { login, register };
