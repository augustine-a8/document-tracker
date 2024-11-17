import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { AuthRequest } from "../@types/authRequest";

const UserRepository = AppDataSource.getRepository(User);

async function getAllUsers(req: Request, res: Response) {
  const allUsers = await UserRepository.find({});

  res.status(200).json({
    message: "All users retrieved",
    allUsers,
  });
}

async function addUser(req: Request, res: Response) {
  const { name, email } = req.body;

  if (!name) {
    res.status(400).json({
      message: "All users should have name provided",
    });
    return;
  }

  if (!email) {
    res.status(400).json({
      message: "All users should have email provided",
    });
    return;
  }

  const user = new User();
  user.userId = uuidv4();
  user.name = name;
  user.email = email;

  await UserRepository.save(user);

  res.status(200).json({
    message: "New user created",
  });
}

async function searchUserByNameOrEmail(req: AuthRequest, res: Response) {
  const { searchParam } = req.body;

  if (!searchParam) {
    res.status(400).json({
      message: "Enter what to search for",
    });
    return;
  }

  const users = await UserRepository.find({});
  const searchResults = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      user.email.toLowerCase().includes(searchParam.toLowerCase())
  );

  res.status(200).json({
    message: "Search results returned",
    searchResults: searchResults.filter(
      (user) => user.userId !== req.user.userId
    ),
  });
}

async function getMyAccount(req: AuthRequest, res: Response) {
  const user = req.user;
  const myAccount = await UserRepository.findOne({
    where: { userId: user.userId },
  });
  if (!myAccount) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    message: "User found",
    myAccount,
  });
}

async function getAllDepartmentHeads(req: AuthRequest, res: Response) {
  const departmentHeads = await UserRepository.find({ where: { role: "HOD" } });

  res.status(200).json({
    message: "Retrieved all department heads",
    departmentHeads,
  });
}

export {
  getAllUsers,
  addUser,
  searchUserByNameOrEmail,
  getMyAccount,
  getAllDepartmentHeads,
};
