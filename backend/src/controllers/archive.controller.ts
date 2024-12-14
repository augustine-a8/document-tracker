import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AuthRequest } from "../@types/authRequest";
import {
  Archive,
  ArchiveNotification,
  ArchiveTransaction,
  User,
} from "../entities";
import { AppDataSource } from "../data-source";
import { SocketService } from "../services/SocketService";
import { ILike } from "typeorm";
import { NotificationEvent } from "../@types/notification";

const ArchiveRepository = AppDataSource.getRepository(Archive);
const ArchiveTransactionRepository =
  AppDataSource.getRepository(ArchiveTransaction);
const NotificationRepository = AppDataSource.getRepository(ArchiveNotification);
const UserRepository = AppDataSource.getRepository(User);

async function addToArchive(req: AuthRequest, res: Response) {
  const { itemNumber, description, remarks, coveringDate, fileNumber } =
    req.body;

  const user = req.user;

  if (user?.role !== "archiver") {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const archive = new Archive();
  archive.archiveId = uuidv4();
  archive.itemNumber = itemNumber;
  archive.description = description;
  archive.remarks = remarks;
  archive.coveringDate = coveringDate;
  archive.fileNumber = fileNumber;
  const savedArchive = await ArchiveRepository.save(archive);

  res.status(200).json({
    message: "New archive added",
    archive: savedArchive,
  });
}

async function getAllArchiveDocuments(req: Request, res: Response) {
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  const [archives, total] = await ArchiveRepository.findAndCount({
    where: [
      {
        itemNumber: ILike(`%${search}%`),
      },
      { description: ILike(`%${search}%`) },
    ],
    take: pageSize,
    skip: startNumber - 1,
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "All archive documents retrieved",
    archives,
    meta: {
      total,
      start,
      end,
    },
  });
}

async function getArchiveDocumentById(req: AuthRequest, res: Response) {
  const { id: archiveId } = req.params;
  const user = req.user;

  const archive = await ArchiveRepository.findOne({ where: { archiveId } });
  if (!archive) {
    res.status(404).json({
      message: "Archive document with id not found",
    });
    return;
  }

  const allArchiveTransactions = await ArchiveTransactionRepository.find({
    where: { archiveId, requestedById: user?.userId },
    relations: {
      requestedBy: true,
    },
  });

  res.status(200).json({
    message: "Archive retrieved",
    archive: {
      ...archive,
      transactions: allArchiveTransactions,
    },
  });
}

async function requestForArchiveDocument(req: AuthRequest, res: Response) {
  const { id: archiveId } = req.params;
  const { department } = req.body;

  const archive = await ArchiveRepository.findOne({ where: { archiveId } });
  if (!archive) {
    res.status(404).json({
      message: "Archive document not found",
    });
    return;
  }

  const user = req.user;

  const archiveTransaction = new ArchiveTransaction();
  archiveTransaction.transactionId = uuidv4();
  archiveTransaction.archiveId = archiveId;
  archiveTransaction.requestedById = user!.userId;
  archiveTransaction.requestedAt = new Date();
  archiveTransaction.department = department;

  const savedTransaction = await ArchiveTransactionRepository.save(
    archiveTransaction
  );

  const newTransaction = await ArchiveTransactionRepository.findOne({
    where: { transactionId: savedTransaction.transactionId },
    relations: {
      requestedBy: true,
    },
  });

  const director = await UserRepository.findOne({
    where: { department, role: "director" },
  });

  if (!director) {
    res.status(404).json({
      message: "No director for department",
    });
    return;
  }

  // notification should be sent to the director for request approval
  const notification = new ArchiveNotification();
  notification.notificationId = uuidv4();
  notification.transactionId = newTransaction!.transactionId;
  notification.senderId = user.userId;
  notification.receiverId = director.userId;
  notification.message = `Approve ${user.name}'s request for ${archive.itemNumber} with description ${archive.description} from archives`;
  const savedNotification = await NotificationRepository.save(notification);

  if (SocketService.getInstance().isUserOnline(director.userId)) {
    SocketService.getInstance().emitToUser(
      director.userId,
      NotificationEvent.ArchiveRequest,
      {
        notification: savedNotification,
      }
    );
  }
  res.status(200).json({
    message: "Archive document requested for",
    transaction: newTransaction,
  });
}

async function approveRequestForArchiveDocument(
  req: AuthRequest,
  res: Response
) {
  const { transactionIds } = req.body;
  const user = req.user;
  if (user?.role !== "director") {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const promises = transactionIds.map(async (transactionId: string) => {
    const archiveTransaction = await ArchiveTransactionRepository.findOne({
      where: { transactionId },
      relations: {
        archive: true,
      },
    });
    if (!archiveTransaction) {
      console.log("Archive transaction not found for: ", transactionId);
      return;
    }

    await ArchiveTransactionRepository.update(
      { transactionId },
      { approved: true }
    );

    // send notification to requester to showing the request approval status
    const notification = new ArchiveNotification();
    notification.notificationId = uuidv4();
    notification.transactionId = transactionId;
    notification.senderId = user.userId;
    notification.receiverId = archiveTransaction.requestedById;
    notification.message = `Request for archive document with archival number ${archiveTransaction.archive.archivalNumber} on ${archiveTransaction.requestedAt} approved by the director`;
    const savedNotification = await ArchiveNotification.save(notification);

    const socketInstance = SocketService.getInstance();
    if (socketInstance.isUserOnline(archiveTransaction.requestedById)) {
      socketInstance.emitToUser(
        archiveTransaction.requestedById,
        NotificationEvent.ArchiveRequestApproval,
        {
          notification: savedNotification,
        }
      );
    }
    return transactionId;
  });

  const allPromiseResults = await Promise.all(promises);
  const resolvedPromises = allPromiseResults.filter(
    (promiseResult) => promiseResult
  );
  const rejectedPromises = transactionIds.filter(
    (id: string) => !resolvedPromises.includes(id)
  );

  res.status(200).json({
    message: "Archive document request approval saved",
    unapprovedTransactionIds: rejectedPromises,
  });
}

async function fulfillRequestForArchiveDocument(
  req: AuthRequest,
  res: Response
) {
  console.log("Fulfill Archive Request");
  const { transactionIds } = req.body;
  const user = req.user;

  const fulfillPromises = transactionIds.map(async (transactionId: string) => {
    const archiveTransaction = await ArchiveTransactionRepository.findOne({
      where: { transactionId },
      relations: { archive: true, requestedBy: true },
    });
    if (!archiveTransaction) {
      console.log(`Archive transaction with id: ${transactionId} not found`);
      return;
    }

    if (!archiveTransaction.approved) {
      console.log(`Archive transaction with id: ${transactionId} not approved`);
      return;
    }

    await ArchiveTransactionRepository.update(
      { transactionId },
      { retrievedBy: user?.name, dateProduced: new Date(), produced: true }
    );

    // send notification to requester of request fulfillment status
    const notification = new ArchiveNotification();
    notification.notificationId = uuidv4();
    notification.transactionId = transactionId;
    notification.senderId = user.userId;
    notification.receiverId = archiveTransaction.requestedById;
    notification.message = `Request for archive document with item number ${archiveTransaction.archive.itemNumber} on ${archiveTransaction.requestedAt} fulfilled by archiver`;
    const savedNotification = await NotificationRepository.save(notification);

    const socketInstance = SocketService.getInstance();
    if (socketInstance.isUserOnline(archiveTransaction.requestedById)) {
      socketInstance.emitToUser(
        archiveTransaction.requestedById,
        NotificationEvent.ArchiveRequestFulfillMent,
        {
          notification: savedNotification,
        }
      );
    }
    return transactionId;
  });

  Promise.all(fulfillPromises).then((data) => {
    const fulfilledRequests = data.filter((item) => item);
    const unFulfilledRequests = transactionIds.filter(
      (item: string) => !fulfilledRequests.includes(item)
    );
    res.status(200).json({
      message: "Fulfilled all requests for archive documents",
      unFulfilledRequests,
    });
  });
}

async function returnArchiveDocument(req: Request, res: Response) {
  const { id: transactionId } = req.params;
  const { remarks } = req.body;

  const transaction = await ArchiveTransactionRepository.findOne({
    where: { transactionId },
  });
  if (!transaction) {
    res.status(404).json({
      message: "Transaction with id provided not found",
    });
    return;
  }

  transaction.dateReturned = new Date();
  transaction.remarks = remarks ? remarks : "";
  const savedTransaction = await ArchiveTransactionRepository.save(transaction);

  res.status(200).json({
    message: "Archive document returned",
    transaction: savedTransaction,
  });
}

async function getAllUserArchiveDocumentRequest(
  req: AuthRequest,
  res: Response
) {
  const user = req.user;
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  const [userRequests, total] = await ArchiveTransactionRepository.findAndCount(
    {
      where: [
        {
          requestedById: user!.userId,
          produced: false,
          archive: { itemNumber: ILike(`%${search}%`) },
        },
        {
          requestedById: user!.userId,
          produced: false,
          archive: { fileNumber: ILike(`%${search}%`) },
        },
        {
          requestedById: user!.userId,
          produced: false,
          archive: { description: ILike(`%${search}%`) },
        },
      ],
      relations: {
        requestedBy: true,
        archive: true,
      },
      take: pageSize,
      skip: startNumber - 1,
    }
  );

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "All user archive requests retrieved",
    userRequests,
    meta: {
      total,
      end,
      start,
    },
  });
}

async function getAllArchiveDocumentRequestsAwaitingApproval(
  req: AuthRequest,
  res: Response
) {
  const user = req.user;
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  if (user?.role !== "director") {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const director = await UserRepository.findOne({
    where: { userId: user.userId },
  });
  if (!director) {
    res.status(404).json({
      message: "Director with id not found",
    });
    return;
  }

  const [awaitingApproval, total] =
    await ArchiveTransactionRepository.findAndCount({
      where: [
        {
          department: director.department,
          approved: false,
          archive: { itemNumber: ILike(`%${search}%`) },
        },
        {
          department: director.department,
          approved: false,
          archive: { fileNumber: ILike(`%${search}%`) },
        },
        {
          department: director.department,
          approved: false,
          archive: { description: ILike(`%${search}%`) },
        },
        {
          department: director.department,
          approved: false,
          requestedBy: { name: ILike(`%${search}%`) },
        },
      ],
      relations: {
        archive: true,
        requestedBy: true,
      },
      skip: startNumber - 1,
      take: pageSize,
    });

  const transactionsAwaitingApproval = awaitingApproval.map((item) => {
    return {
      ...item,
      requestedBy: {
        name: item.requestedBy.name,
        department: item.requestedBy.department,
        userId: item.requestedBy.userId,
      },
    };
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "Archive documents awaiting approval retrieved",
    transactionsAwaitingApproval,
    meta: {
      start,
      end,
      total,
    },
  });
}

async function getAllArchiveDocumentRequestsAwaitingFulfillment(
  req: Request,
  res: Response
) {
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  const [approvedTransaction, total] =
    await ArchiveTransactionRepository.findAndCount({
      where: [
        {
          approved: true,
          produced: false,
          archive: { itemNumber: ILike(`%${search}%`) },
        },
        {
          approved: true,
          produced: false,
          archive: { fileNumber: ILike(`%${search}%`) },
        },
        {
          approved: true,
          produced: false,
          archive: { description: ILike(`%${search}%`) },
        },
        {
          approved: true,
          produced: false,
          requestedBy: { name: ILike(`%${search}%`) },
        },
        {
          approved: true,
          produced: false,
          requestedBy: { department: ILike(`%${search}%`) },
        },
      ],
      relations: {
        archive: true,
        requestedBy: true,
      },
      skip: startNumber - 1,
      take: pageSize,
    });

  const awaitingFulfillment = approvedTransaction.map((item) => {
    return {
      ...item,
      requestedBy: {
        userId: item.requestedBy.userId,
        name: item.requestedBy.name,
        department: item.requestedBy.department,
      },
    };
  });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "Archive documents awaiting fulfillment retrieved",
    awaitingFulfillment,
    meta: {
      start,
      end,
      total,
    },
  });
}

export {
  addToArchive,
  getAllArchiveDocuments,
  getArchiveDocumentById,
  requestForArchiveDocument,
  approveRequestForArchiveDocument,
  fulfillRequestForArchiveDocument,
  returnArchiveDocument,
  getAllUserArchiveDocumentRequest,
  getAllArchiveDocumentRequestsAwaitingApproval,
  getAllArchiveDocumentRequestsAwaitingFulfillment,
};
