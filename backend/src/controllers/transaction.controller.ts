import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Transaction, Document, Notification, User } from "../entity";
import { AuthRequest } from "../@types/authRequest";

const TransactionRepository = AppDataSource.getRepository(Transaction);
const DocumentRepository = AppDataSource.getRepository(Document);
const NotificationRepository = AppDataSource.getRepository(Notification);

async function getTransactionsForDocument(req: Request, res: Response) {
  const { id: documentId } = req.params;

  const document = await DocumentRepository.findOneBy({ documentId });

  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
    });
    return;
  }

  const transactions = await TransactionRepository.find({
    where: { documentId: document.documentId },
    relations: { sender: true, receiver: true },
  });
  transactions.sort(
    (a, b) => b.sentTimestamp.getTime() - a.sentTimestamp.getTime()
  );
  res.status(200).json({
    message: "Document transactions retrieved",
    transactions,
  });
}

// TODO: get rid of this controller
async function getAllTransactions(req: Request, res: Response) {
  const allTransactions = await TransactionRepository.find({
    relations: { document: true, sender: true, receiver: true },
  });

  res.status(200).json({
    message: "All transactions retrieved",
    allTransactions,
  });
}

async function acknowledgeDocument(req: AuthRequest, res: Response) {
  const { id: transactionId } = req.params;
  const { notificationId } = req.body;
  const userId = req.user.userId;

  const notification = await NotificationRepository.findOneBy({
    notificationId,
  });
  if (!notification) {
    res.status(404).json({
      message: "Invalid notification id",
    });
    return;
  }

  const transaction = await TransactionRepository.findOneBy({ transactionId });
  if (!transaction) {
    res.status(404).json({
      message: "Invalid transaction id",
    });
    return;
  }

  if (transaction.receiverId !== userId) {
    res.status(403).json({
      message: "Action not allowed. Only receiver of document can acknowledge",
    });
    return;
  }

  const document = await DocumentRepository.findOneBy({
    documentId: transaction.documentId,
  });

  if (!document) {
    res.status(404).json({
      message: "Document associated with transaction does not exist",
    });
    return;
  }

  document.currentHolderId = userId;
  const savedDocument = await DocumentRepository.save(document);

  notification.acknowledged = true;
  await NotificationRepository.save(notification);

  transaction.acknowledgedTimestamp = new Date();
  await TransactionRepository.save(transaction);

  res.status(200).json({
    message: "Document acknowledged successfully",
    document: savedDocument,
  });
}

async function acknowledgeMultipleDocuments(req: AuthRequest, res: Response) {
  const { acknowledgements } = req.body;
  const userId = req.user.userId;

  acknowledgements.forEach(
    async (acknowledgement: {
      transactionId: string;
      notificationId: string;
    }) => {
      const { transactionId, notificationId } = acknowledgement;

      const notification = await NotificationRepository.findOneBy({
        notificationId,
      });
      if (!notification) {
        res.status(404).json({
          message: "Invalid notification id",
        });
        return;
      }

      const transaction = await TransactionRepository.findOneBy({
        transactionId,
      });
      if (!transaction) {
        res.status(404).json({
          message: "Invalid transaction id",
        });
        return;
      }

      if (transaction.receiverId !== userId) {
        res.status(403).json({
          message:
            "Action not allowed. Only receiver of document can acknowledge",
        });
        return;
      }

      const document = await DocumentRepository.findOneBy({
        documentId: transaction.documentId,
      });

      if (!document) {
        res.status(404).json({
          message: "Document associated with transaction does not exist",
        });
        return;
      }

      document.currentHolderId = userId;
      await DocumentRepository.save(document);

      notification.acknowledged = true;
      await NotificationRepository.save(notification);

      transaction.acknowledgedTimestamp = new Date();
      await TransactionRepository.save(transaction);
    }
  );

  res.status(200).json({
    message: "Acknowledged all documents",
  });
}

export {
  getTransactionsForDocument,
  getAllTransactions,
  acknowledgeDocument,
  acknowledgeMultipleDocuments,
};
