import { NextFunction, Router, Response } from "express";
import {
  addNewDriver,
  addNewMail,
  dispatchMail,
  findDriverByName,
  getAllDrivers,
  getAllMails,
  getAllDeliveredMails,
  getAllPendingMails,
  getAllTransitMails,
  getAllMailsForDriver,
  getMailById,
  receiveMail,
  getDriverById,
} from "../controllers/mail.controller";
import {
  addNewDriverSchema,
  addNewMailSchema,
  dispatchMailSchema,
  findDriverByNameSchema,
  receiveMailSchema,
} from "../validations/mail.validation";
import { validateRequest } from "../middleware/validateRequest";
import { AuthRequest } from "../@types/authRequest";
import { Endpoint } from "../@types/endpoint";
import { checkAuthentication } from "../middleware/check-auth";
import { asyncHandler } from "../lib/async-wrapper";

const isRegistrar = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user.role !== "registrar") {
    res.status(403).json({
      message: "Action not allowed",
    });
    return;
  }
  next();
};

const router = Router();

router.get("/", checkAuthentication, isRegistrar, asyncHandler(getAllMails));
router.get(
  "/pending",
  checkAuthentication,
  isRegistrar,
  asyncHandler(getAllPendingMails)
);
router.get(
  "/transit",
  checkAuthentication,
  isRegistrar,
  asyncHandler(getAllTransitMails)
);
router.get(
  "/delivered",
  checkAuthentication,
  isRegistrar,
  asyncHandler(getAllDeliveredMails)
);
router.post(
  "/",
  checkAuthentication,
  isRegistrar,
  validateRequest(addNewMailSchema),
  asyncHandler(addNewMail)
);
router.post(
  "/dispatch/:id",
  checkAuthentication,
  isRegistrar,
  validateRequest(dispatchMailSchema),
  asyncHandler(dispatchMail)
);
router.post(
  "/receive",
  checkAuthentication,
  validateRequest(receiveMailSchema),
  asyncHandler(receiveMail)
);
router.get("/drivers", checkAuthentication, isRegistrar, getAllDrivers);
router.post(
  "/drivers",
  checkAuthentication,
  validateRequest(addNewDriverSchema),
  asyncHandler(addNewDriver)
);
router.get(
  "/drivers/:id",
  checkAuthentication,
  isRegistrar,
  asyncHandler(getDriverById)
);
router.get(
  "/drivers/:id/deliveries",
  checkAuthentication,
  asyncHandler(getAllMailsForDriver)
);
router.post(
  "/drivers/search",
  checkAuthentication,
  isRegistrar,
  validateRequest(findDriverByNameSchema),
  asyncHandler(findDriverByName)
);
router.get("/:id", checkAuthentication, isRegistrar, asyncHandler(getMailById));

const mailEndpoint: Endpoint = {
  path: "/mails",
  router,
};

export { mailEndpoint };
