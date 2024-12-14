import { Request, Response } from "express";
import { ArchiveNotification } from "../entities";
import { AppDataSource } from "../data-source";
import { AuthRequest } from "../@types/authRequest";
import { ActiveDocNotification } from "../entities/ActiveDocNotification.new";

const ArchiveNotificationRepository =
  AppDataSource.getRepository(ArchiveNotification);
const ActiveDocNotificationRepository = AppDataSource.getRepository(
  ActiveDocNotification
);

async function getAllNotifications(req: AuthRequest, res: Response) {
  const user = req.user;
  const activeDocNotifications = await ActiveDocNotificationRepository.find({
    where: { read: false, receiverId: user.userId },
    relations: {
      transactionStateHistory: true,
    },
  });

  const archiveNotifications = await ArchiveNotificationRepository.find({
    where: { read: false, receiverId: user.userId },
    relations: {
      transaction: true,
    },
  });

  res.status(200).json({
    message: "All user notifications retrieved",
    activeDocNotifications,
    archiveNotifications,
    meta: {
      total: activeDocNotifications.length + archiveNotifications.length,
    },
  });
}

async function readUserNotifications(req: Request, res: Response) {
  const { notifications } = req.body;

  const readNotificationsPromise = notifications.map(
    async (notification: {
      notificationId: string;
      type: "archive" | "active";
    }) => {
      switch (notification.type) {
        case "active": {
          const activeDocNotification =
            await ActiveDocNotificationRepository.findOne({
              where: {
                notificationId: notification.notificationId,
                read: false,
              },
            });
          if (!activeDocNotification) {
            return;
          }
          activeDocNotification.read = true;
          await ActiveDocNotificationRepository.save(notification);
          return notification.notificationId;
        }
        case "archive": {
          const archiveNotification =
            await ArchiveNotificationRepository.findOne({
              where: {
                notificationId: notification.notificationId,
                read: false,
              },
            });
          if (!archiveNotification) {
            return;
          }
          archiveNotification.read = true;
          await ArchiveNotificationRepository.save(archiveNotification);
          return notification.notificationId;
        }
      }
    }
  );

  Promise.all(readNotificationsPromise).then((readNotificationIds) => {
    const unreadNotifications = notifications.filter(
      (notification: string) =>
        !readNotificationIds
          .filter((notificationId) => notificationId)
          .includes(notification)
    );
    res.status(200).json({
      message: "Notifications read",
      unreadNotifications,
    });
  });
}

export { getAllNotifications, readUserNotifications };
