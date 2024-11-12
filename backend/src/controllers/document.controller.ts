import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../data-source";
import { Document, User, Transaction } from "../entity";
import { AuthRequest } from "../@types/authRequest";
import { SocketService } from "../services/SocketService";
import { Notification } from "../entity/Notification";

const DocumentRepository = AppDataSource.getRepository(Document);
const UserRepository = AppDataSource.getRepository(User);
const TransactionRepository = AppDataSource.getRepository(Transaction);
const NotificationRepository = AppDataSource.getRepository(Notification);

async function getAllDocuments(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user.userId) {
    res.status(403).json({
      message: "Invalid token",
    });
    return;
  }

  const allDocuments = await DocumentRepository.find({
    where: [{ creatorId: user.userId }, { currentHolderId: user.userId }],
  });

  res.status(200).json({
    message: "Retrieved all documents",
    allDocuments,
  });
}

async function getDocumentById(req: Request, res: Response) {
  const { id: documentId } = req.params;
  const document = await DocumentRepository.findOne({
    where: { documentId },
    relations: { currentHolder: true, transactions: true, creator: true },
  });

  if (!document) {
    res.status(404).json({
      message: "Document does not exist",
    });
  } else {
    res.status(200).json({
      message: "Document retrieved",
      document,
    });
  }
}

async function addDocument(req: AuthRequest, res: Response) {
  const { title, description, serialNumber, type } = req.body;

  if (!title) {
    res.status(400).json({
      message: "Document title is required",
    });
    return;
  }
  if (!serialNumber) {
    res.status(400).json({
      message: "Document serial number is required",
    });
    return;
  }
  if (!type) {
    res.status(400).json({
      message: "Document type is required",
    });
    return;
  }

  const existingDocument = await DocumentRepository.findOneBy({
    serialNumber: serialNumber,
  });
  if (existingDocument) {
    res.status(400).json({
      message: "Document with serial number already exists",
    });
    return;
  }

  const user = req.user;
  if (!user.userId) {
    res.status(403).json({
      message: "Unauthorized user. Cannot perform action",
    });
    return;
  }

  const document = new Document();
  document.documentId = uuidv4();
  document.title = title;
  document.description = description ? description : "";
  document.serialNumber = serialNumber;
  document.type = type;
  document.currentHolderId = user.userId;
  document.creatorId = user.userId;

  const newDocument = await DocumentRepository.save(document);

  res.status(200).json({
    message: "New document added",
    newDocument,
  });
}

// TODO: Figure out what to do with document update
// async function updateDocument(req: Request, res: Response) {
//   const { id: document_id } = req.params;
//   const { title, description, serialNumber } = req.body;

//   const document = await DocumentRepository.findOneBy({ document_id });
//   if (!document) {
//     res.status(404).json({
//       message: "Document with id provided not found",
//       document: null,
//     });
//     return;
//   }

//   if (title) {
//     document.title = title;
//   }
//   if (description) {
//     document.description = description;
//   }
//   if (serialNumber) {
//     document.serial_number = serialNumber;
//   }

//   const updatedDocument = await DocumentRepository.save(document);

//   res.status(200).json({
//     message: "Document updated successfully",
//     document: updatedDocument,
//   });
// }

async function sendDocument(req: AuthRequest, res: Response) {
  const { id: documentId } = req.params;
  const { receiverId, comment } = req.body;

  if (!receiverId) {
    res.status(400).json({
      message: "Document receiver must be provided",
    });
    return;
  }
  if (!comment) {
    res.status(400).json({
      message: "Please provide a reason/purpose for sending",
    });
    return;
  }

  const document = await DocumentRepository.findOneBy({ documentId });

  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
    });
    return;
  }

  const receiver = await UserRepository.findOneBy({ userId: receiverId });

  if (!receiver) {
    res.status(404).json({
      message: "Receiver of document not found",
    });
    return;
  }

  const ownerId = document.currentHolderId;
  const senderId = req.user.userId;

  if (senderId !== ownerId) {
    res.status(403).json({
      message: "Action not allowed. Only current owner of document can send",
    });
    return;
  }

  const transaction = new Transaction();
  transaction.transactionId = uuidv4();
  transaction.documentId = documentId;
  transaction.senderId = senderId;
  transaction.sentTimestamp = new Date();
  transaction.comment = comment;
  transaction.receiverId = receiverId;

  const savedTransaction = await TransactionRepository.save(transaction);
  const newTransaction = await TransactionRepository.findOne({
    where: { transactionId: savedTransaction.transactionId },
    relations: {
      sender: true,
      receiver: true,
    },
  });

  document.currentHolderId = receiverId;
  const savedDocument = await DocumentRepository.save(document);

  res.status(200).json({
    message: "Document sent successfully",
    document: savedDocument,
    transaction: newTransaction,
  });

  const notification = new Notification();
  notification.notificationId = uuidv4();
  notification.transactionId = savedTransaction.transactionId;
  notification.acknowledged = false;
  notification.documentId = documentId;

  const n = await NotificationRepository.save(notification);
  const newNotification = await NotificationRepository.findOne({
    where: { notificationId: n.notificationId },
    relations: {
      document: true,
      transaction: true,
    },
  });

  const sender = await UserRepository.findOne({ where: { userId: senderId } });

  console.log("Sending socket event to client");
  if (SocketService.getInstance().isUserOnline(receiverId)) {
    SocketService.getInstance().emitToUser(receiverId, "acknowledge_document", {
      ...newNotification,
      sender,
      receiver,
    });
  }
}

async function returnDocument(req: AuthRequest, res: Response) {
  const { id: documentId } = req.params;
  const { comment, transactionId, notificationId } = req.body;

  if (!transactionId) {
    res.status(400).json({
      message: "Transaction id must be provided",
    });
    return;
  }

  if (!notificationId) {
    res.status(400).json({
      message: "Notification id must be provided",
    });
    return;
  }

  if (!comment) {
    res.status(400).json({
      message: "Please provide a reason/purpose for returning the document",
    });
    return;
  }

  const document = await DocumentRepository.findOneBy({ documentId });

  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
    });
    return;
  }

  const transaction = await TransactionRepository.findOne({
    where: { transactionId },
    relations: { sender: true, receiver: true },
  });
  if (!transaction) {
    res.status(404).json({
      message: "No transaction for transaction id provided",
    });
    return;
  }

  const notification = await NotificationRepository.findOne({
    where: { notificationId },
  });
  if (!notification) {
    res.status(404).json({
      message: "No notification for notification id provided",
    });
    return;
  }

  const userId = req.user.userId;
  if (userId !== transaction.receiverId) {
    res.status(403).json({
      message: "Action not allowed. Only document receiver can return document",
    });
    return;
  }

  notification.acknowledged = true;
  await NotificationRepository.save(notification);

  transaction.acknowledgedTimestamp = new Date();
  await TransactionRepository.save(transaction);

  // Create new transaction and notification for sending back

  const newTransaction = new Transaction();
  newTransaction.transactionId = uuidv4();
  newTransaction.documentId = documentId;
  newTransaction.senderId = userId;
  newTransaction.sentTimestamp = new Date();
  newTransaction.acknowledgedTimestamp = new Date();
  newTransaction.comment = comment;
  newTransaction.receiverId = transaction.senderId;
  const savedNewTransaction = await TransactionRepository.save(newTransaction);

  const returnNotification = new Notification();
  returnNotification.notificationId = uuidv4();
  returnNotification.transactionId = savedNewTransaction.transactionId;
  returnNotification.acknowledged = true;
  returnNotification.documentId = documentId;
  const s = await NotificationRepository.save(returnNotification);

  document.currentHolderId = transaction.senderId;
  await DocumentRepository.save(document);

  const n = await NotificationRepository.findOne({
    where: { notificationId: s.notificationId },
    relations: {
      transaction: true,
      document: true,
    },
  });

  // Send notification to document original sender
  if (SocketService.getInstance().isUserOnline(transaction.senderId)) {
    SocketService.getInstance().emitToUser(
      transaction.senderId,
      "return_document",
      {
        ...n,
        sender: transaction.receiver,
        receiver: transaction.sender,
      }
    );
  }

  res.status(200).json({
    message: "Document Returned to sender",
  });
}

export {
  getAllDocuments,
  getDocumentById,
  addDocument,
  // updateDocument,
  sendDocument,
  returnDocument,
};
