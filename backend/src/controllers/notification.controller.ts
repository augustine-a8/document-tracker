import { Response } from "express";

import { AuthRequest } from "../@types/authRequest";
import { AppDataSource } from "../data-source";
import { Transaction, Notification } from "../entity";

const NotificationRepository = AppDataSource.getRepository(Notification);
const TransactionRepository = AppDataSource.getRepository(Transaction);

async function getUserNotifications(req: AuthRequest, res: Response) {
  const userId = req.user.userId;

  const notifications = await NotificationRepository.find({
    where: { acknowledged: false },
    relations: {
      document: true,
      transaction: true,
    },
  });

  const userNotifications = notifications.filter(
    (notification) => notification.transaction.receiverId === userId
  );

  const fullUserNotifications = userNotifications.map(async (notification) => {
    const transaction = await Transaction.findOne({
      where: { transactionId: notification.transactionId },
      relations: { sender: true, receiver: true },
    });

    return {
      ...notification,
      sender: transaction?.sender,
      receiver: transaction?.receiver,
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
