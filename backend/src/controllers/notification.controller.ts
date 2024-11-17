import { Response } from "express";

import { AuthRequest } from "../@types/authRequest";
import { AppDataSource } from "../data-source";
import {
  Transaction,
  Notification,
  ArchiveNotification,
  ArchiveTransaction,
} from "../entity";
import { NotificationType } from "../@types/notification";

const TransactionRepository = AppDataSource.getRepository(Transaction);
const NotificationRepository = AppDataSource.getRepository(Notification);

const ArchiveTransactionRepository =
  AppDataSource.getRepository(ArchiveTransaction);
const ArchiveNotificationRepository =
  AppDataSource.getRepository(ArchiveNotification);

async function getUserNotifications(req: AuthRequest, res: Response) {
  const userId = req.user.userId;

  const documentNotifications = await NotificationRepository.find({
    relations: {
      transaction: true,
    },
  });

  const userDocumentNotifications = documentNotifications.filter(
    (notification) =>
      notification.transaction.receiverId === userId &&
      !notification.transaction.acknowledged
  );

  const fullUserDocumentNotifications = userDocumentNotifications.map(
    async (userDocumentNotification) => {
      const transaction = await TransactionRepository.findOne({
        where: { transactionId: userDocumentNotification.transactionId },
        relations: {
          document: true,
          receiver: true,
          sender: true,
        },
      });

      return {
        ...userDocumentNotification,
        transaction,
      };
    }
  );

  const archiveNotifications = await ArchiveNotificationRepository.find({
    relations: {
      transaction: true,
    },
  });

  const userArchiveNotifications = archiveNotifications.filter(
    (notification) =>
      notification.transaction.requesterId === userId &&
      notification.transaction.status !== "submitted"
  );

  const fullUserArchiveNotifications = userArchiveNotifications.map(
    async (userArchiveNotification) => {
      const transaction = await ArchiveTransactionRepository.findOne({
        where: { transactionId: userArchiveNotification.transactionId },
        relations: {
          document: true,
          requester: true,
          requestApprover: true,
        },
      });

      return {
        ...userArchiveNotification,
        transaction,
      };
    }
  );

  const allUserNotifications = [
    ...fullUserArchiveNotifications,
    ...fullUserDocumentNotifications,
  ];

  Promise.all(allUserNotifications).then((allNotifications) => {
    res.status(200).json({
      message: "All notifications retreived",
      notifications: allNotifications,
    });
  });
}

export { getUserNotifications };
