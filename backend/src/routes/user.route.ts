import { Router } from "express";

import { Endpoint } from "../@types/endpoint";
import {addUser, getAllUsers} from '../controllers/user.controller'

const router = Router();

router.get("/", getAllUsers);
router.post("/", addUser);

const usersEndpoint: Endpoint = { path: "/users", router };

export { usersEndpoint };
