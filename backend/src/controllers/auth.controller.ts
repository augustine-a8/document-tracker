import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { hashPassword, verifyPassword } from "../lib/password";
import { generateToken, generateRefreshToken } from "../lib/jwt";
import { AuthRequest } from "../@types/authRequest";
import { Config } from "../config";

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

  const accessToken = generateToken(user.userId, user.email, user.role);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 120 * 60 * 1000, // expires in 2hr
  });

  const refreshToken = generateRefreshToken(user.userId, user.email, user.role);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7d
  });

  res.status(200).json({
    message: "Login successful",
  });
}

async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

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
  user.userId = uuidv4();
  user.name = name;
  user.email = email;
  user.password = hashPassword(password);
  if (role) {
    user.role = role;
  }

  const savedUser = await UserRepository.save(user);
  const accessToken = generateToken(
    savedUser.userId,
    savedUser.email,
    savedUser.role
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 120 * 60 * 1000, // expires in 2hr
  });

  const refreshToken = generateRefreshToken(
    savedUser.userId,
    savedUser.email,
    savedUser.role
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7d
  });

  res.status(200).json({
    message: "Registration successful",
  });
}

async function logout(req: AuthRequest, res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  req.user = null;

  res.status(200).json({
    message: "Logout successful",
  });
}

async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  jwt.verify(refreshToken, Config.refreshTokenSecret, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateToken(user.userId, user.email, user.role);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 120 * 60 * 1000,
    });

    res.json({ message: "Access token refreshed" });
  });
}

export { login, register, logout, refreshToken };
