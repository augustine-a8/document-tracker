import { Response } from "express";

import { AuthRequest } from "../@types/authRequest";
import { Notification } from "../entity/Notification";
import { AppDataSource } from "../data-source";

const NotificationRepository = AppDataSource.getRepository(Notification);

async function getUserNotifications(req: AuthRequest, res: Response) {
  const userId = req.user.userId;

  const notifications = await NotificationRepository.find({
    where: { receiverId: userId, acknowledged: false },
    relations: {
      sender: true,
      receiver: true,
      document: true,
      history: true,
    },
  });

  res.status(200).json({
    message: "All notifications retreived",
    notifications,
  });
}

export { getUserNotifications };
