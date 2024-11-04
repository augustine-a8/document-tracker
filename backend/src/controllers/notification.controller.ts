import { Response } from "express";

import { AuthRequest } from "../@types/authRequest";
import { NotificationQueue } from "../entity/NotificationQueue";
import { AppDataSource } from "../data-source";

const NotificationQueueRepository =
  AppDataSource.getRepository(NotificationQueue);

async function getUserNotifications(req: AuthRequest, res: Response) {
  const userId = req.user.userId;

  const notifications = await NotificationQueueRepository.find({
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
