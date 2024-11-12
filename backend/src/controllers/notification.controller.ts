import { Response } from "express";

import { AuthRequest } from "../@types/authRequest";
import { AppDataSource } from "../data-source";
import { CustodyHistory, Notification } from "../entity";

const NotificationRepository = AppDataSource.getRepository(Notification);
const CustodyHistoryRepository = AppDataSource.getRepository(CustodyHistory);

async function getUserNotifications(req: AuthRequest, res: Response) {
  const userId = req.user.userId;

  const notifications = await NotificationRepository.find({
    where: { acknowledged: false },
    relations: {
      document: true,
      history: true,
    },
  });

  const userNotifications = notifications.filter(
    (notification) => notification.history.receiverId === userId
  );

  const fullUserNotifications = userNotifications.map(async (notification) => {
    const history = await CustodyHistoryRepository.findOne({
      where: { historyId: notification.historyId },
      relations: { sender: true, receiver: true },
    });

    return {
      ...notification,
      sender: history?.sender,
      receiver: history?.receiver,
    };
  });

  Promise.all(fullUserNotifications).then((allNotifications) => {
    res.status(200).json({
      message: "All notifications retreived",
      notifications: allNotifications,
    });
  });
}

export { getUserNotifications };
