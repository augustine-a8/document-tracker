import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { CustodyHistory, Document, NotificationQueue, User } from "../entity";
import { AuthRequest } from "../@types/authRequest";

const CustodyHistoryRepository = AppDataSource.getRepository(CustodyHistory);
const DocumentRepository = AppDataSource.getRepository(Document);
const NotificationQueueRepository =
  AppDataSource.getRepository(NotificationQueue);
const UserRepository = AppDataSource.getRepository(User);

async function getCustodyHistoryForDocument(req: Request, res: Response) {
  const { id: documentId } = req.params;

  const document = await DocumentRepository.findOneBy({ documentId });

  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
    });
    return;
  }

  const custodyHistory = await CustodyHistoryRepository.find({
    where: { documentId: document.documentId },
    relations: { sender: true, receiver: true },
  });
  res.status(200).json({
    message: "Document history retrieved",
    custodyHistory,
  });
}

async function getAllCustodyHistory(req: Request, res: Response) {
  const allHistory = await CustodyHistory.find({
    relations: { document: true, sender: true, receiver: true },
  });

  res.status(200).json({
    message: "All history retrieved",
    allHistory,
  });
}

async function acknowledgeDocument(req: AuthRequest, res: Response) {
  const { id: historyId } = req.params;
  const { notificationId } = req.body;
  const userId = req.user.userId;

  const notification = await NotificationQueueRepository.findOneBy({
    notificationId,
  });
  if (!notification) {
    res.status(404).json({
      message: "Invalid notification id",
    });
    return;
  }

  const history = await CustodyHistoryRepository.findOneBy({ historyId });
  if (!history) {
    res.status(404).json({
      message: "Invalid history id",
    });
    return;
  }

  if (history.receiverId !== userId || notification.receiverId !== userId) {
    res.status(403).json({
      message: "Action not allowed. Only receiver of document can acknowledge",
    });
    return;
  }

  const document = await DocumentRepository.findOneBy({
    documentId: history.documentId,
  });

  if (!document) {
    res.status(404).json({
      message: "Document associated with history does not exist",
    });
    return;
  }

  document.currentHolderId = userId;
  const savedDocument = await DocumentRepository.save(document);

  notification.acknowledged = true;
  await NotificationQueueRepository.save(notification);

  history.acknowledgedTimestamp = new Date();
  await CustodyHistoryRepository.save(history);

  res.status(200).json({
    message: "Document acknowledged successfully",
    document: savedDocument,
  });
}

async function acknowledgeMultipleDocuments(req: AuthRequest, res: Response) {
  const { acknowledgements } = req.body;
  const userId = req.user.userId;

  acknowledgements.forEach(
    async (acknowledgement: { historyId: string; notificationId: string }) => {
      const { historyId, notificationId } = acknowledgement;

      const notification = await NotificationQueueRepository.findOneBy({
        notificationId,
      });
      if (!notification) {
        res.status(404).json({
          message: "Invalid notification id",
        });
        return;
      }

      const history = await CustodyHistoryRepository.findOneBy({ historyId });
      if (!history) {
        res.status(404).json({
          message: "Invalid history id",
        });
        return;
      }

      if (history.receiverId !== userId || notification.receiverId !== userId) {
        res.status(403).json({
          message:
            "Action not allowed. Only receiver of document can acknowledge",
        });
        return;
      }

      const document = await DocumentRepository.findOneBy({
        documentId: history.documentId,
      });

      if (!document) {
        res.status(404).json({
          message: "Document associated with history does not exist",
        });
        return;
      }

      document.currentHolderId = userId;
      const savedDocument = await DocumentRepository.save(document);

      notification.acknowledged = true;
      await NotificationQueueRepository.save(notification);

      history.acknowledgedTimestamp = new Date();
      await CustodyHistoryRepository.save(history);
    }
  );

  res.status(200).json({
    message: "Acknowledged all documents",
  });
}

export {
  getCustodyHistoryForDocument,
  getAllCustodyHistory,
  acknowledgeDocument,
  acknowledgeMultipleDocuments,
};
