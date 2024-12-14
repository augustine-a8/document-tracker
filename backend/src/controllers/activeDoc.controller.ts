import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  ActiveDoc,
  ActiveDocTransaction,
  ActiveDocNotification,
  User,
} from "../entities";
import { AppDataSource } from "../data-source";
import { AuthRequest } from "../@types/authRequest";
import { SocketService } from "../services/SocketService";
import { Any, ILike } from "typeorm";
import { NotificationEvent } from "../@types/notification";
import { ActiveDocTransactionState } from "../@types/activeDocTransaction";

const ActiveDocRepository = AppDataSource.getRepository(ActiveDoc);
const ActiveDocTransactionRepository =
  AppDataSource.getRepository(ActiveDocTransaction);
const ActiveDocNotificationRepository = AppDataSource.getRepository(
  ActiveDocNotification
);
const UserRepository = AppDataSource.getRepository(User);

async function getAllActiveDocs(req: AuthRequest, res: Response) {
  const user = req.user;
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  const _user = await AppDataSource.getRepository(User).findOne({
    where: { userId: user.userId },
  });
  if (!_user) {
    res.status(404).json({
      message: "No _user",
    });
    return;
  }

  const [activeDocs, total] = await ActiveDocRepository.findAndCount({
    where: [
      { originatorId: user!.userId, referenceNumber: ILike(`%${search}%`) },
      { currentHolderId: user!.userId, referenceNumber: ILike(`%${search}%`) },
      { originatorId: user!.userId, subject: ILike(`%${search}%`) },
      { currentHolderId: user!.userId, subject: ILike(`%${search}%`) },
    ],
    skip: startNumber - 1,
    take: pageSize,
  });

  // const [activeDocs, total] = await ActiveDocRepository.createQueryBuilder(
  //   "document"
  // )
  //   .where(
  //     "document.originatorId = :userId AND document.referenceNumber ILIKE :search",
  //     {
  //       userId: user!.userId,
  //       search: `%${search}%`,
  //     }
  //   )
  //   .orWhere(
  //     "document.currentHolderId = :userId AND document.referenceNumber ILIKE :search",
  //     {
  //       userId: user!.userId,
  //       search: `%${search}%`,
  //     }
  //   )
  //   .orWhere(
  //     "document.originatorId = :userId AND document.subject ILIKE :search",
  //     {
  //       userId: user!.userId,
  //       search: `%${search}%`,
  //     }
  //   )
  //   .orWhere(
  //     "document.currentHolderId = :userId AND document.subject ILIKE :search",
  //     {
  //       userId: user!.userId,
  //       search: `%${search}%`,
  //     }
  //   )
  //   .skip(startNumber - 1)
  //   .take(pageSize)
  //   .getManyAndCount();

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "Active docs retrieved",
    activeDocs,
    meta: {
      total,
      start,
      end,
    },
  });
}

async function getActiveDocById(req: AuthRequest, res: Response) {
  const { id: activeDocId } = req.params;
  const user = req.user;

  const activeDoc = await ActiveDocRepository.findOne({
    where: { activeDocId },
    relations: {
      currentHolder: true,
      originator: true,
    },
  });
  if (!activeDoc) {
    res.status(404).json({
      message: "Active doc with id provided not found",
    });
    return;
  }

  const activeDocTransactions = await ActiveDocTransactionRepository.find({
    where: { activeDocId },
    relations: {
      source: true,
      forwardedTo: true,
    },
  });

  const unacknowledgedTransaction =
    await ActiveDocTransactionRepository.findOne({
      where: {
        activeDocId,
        acknowledged: false,
        state: ActiveDocTransactionState.SENT,
        forwardedToId: user.userId,
      },
    });

  res.status(200).json({
    message: "Retrieved active doc with id",
    activeDoc,
    transactions: activeDocTransactions,
    unacknowledgedTransaction,
  });
}

async function addActiveDoc(req: AuthRequest, res: Response) {
  const { subject, referenceNumber } = req.body;

  const user = req.user;

  const existingDoc = await ActiveDocRepository.find({
    where: { referenceNumber },
  });
  if (existingDoc.length > 0) {
    res.status(400).json({
      message: "Document with reference number already exists",
    });
    return;
  }

  const holder = await AppDataSource.getRepository(User).findOne({
    where: { userId: user.userId },
  });
  if (!holder) {
    res.status(404).json({
      message: "No _user on create",
    });
    return;
  }

  const activeDoc = new ActiveDoc();
  activeDoc.activeDocId = uuidv4();
  activeDoc.subject = subject;
  activeDoc.referenceNumber = referenceNumber;
  activeDoc.currentHolderId = holder.userId;
  activeDoc.originatorId = holder.userId;

  const savedActiveDoc = await ActiveDocRepository.save(activeDoc);

  res.status(200).json({
    message: "Added new active doc",
    activeDoc: savedActiveDoc,
  });
}

async function forwardActiveDoc(req: AuthRequest, res: Response) {
  const { id: activeDocId } = req.params;
  const { comments, forwardToId } = req.body;

  const activeDoc = await ActiveDocRepository.findOne({
    where: { activeDocId },
    relations: {
      currentHolder: true,
    },
  });
  if (!activeDoc) {
    res.status(404).json({
      message: "Active doc with id provided not found",
    });
    return;
  }
  const senderName = activeDoc.currentHolder.name;

  const user = req.user;

  if (activeDoc.currentHolderId !== user?.userId) {
    res.status(403).json({
      message: "Only current holder of active doc can forward active doc",
    });
    return;
  }

  const activeDocTransaction = new ActiveDocTransaction();
  activeDocTransaction.transactionId = uuidv4();
  activeDocTransaction.activeDocId = activeDocId;
  activeDocTransaction.comments = comments;
  activeDocTransaction.sourceId = user!.userId;
  activeDocTransaction.forwardedToId = forwardToId;
  activeDocTransaction.forwardedAt = new Date();

  const savedActiveDocTransaction = await ActiveDocTransactionRepository.save(
    activeDocTransaction
  );

  // activeDoc.currentHolderId = forwardToId;
  // await ActiveDocRepository.save(activeDoc);

  await ActiveDocRepository.update(
    { activeDocId },
    { currentHolderId: forwardToId }
  );

  const newTransaction = await ActiveDocTransactionRepository.findOne({
    where: { transactionId: savedActiveDocTransaction.transactionId },
    relations: {
      forwardedTo: true,
      source: true,
    },
  });

  const updatedActiveDoc = await ActiveDocRepository.findOne({
    where: { activeDocId },
    relations: {
      currentHolder: true,
      originator: true,
    },
  });

  res.status(200).json({
    message: "Active doc forwared successfully",
    transaction: newTransaction,
    activeDoc: updatedActiveDoc,
  });

  const notification = new ActiveDocNotification();
  notification.notificationId = uuidv4();
  notification.transactionId = savedActiveDocTransaction.transactionId;
  notification.senderId = user.userId;
  notification.receiverId = forwardToId;
  notification.message = `${senderName} forwarded ${
    activeDoc.subject
  } to you on ${new Date().toUTCString()} with comments ${comments}`;
  const savedNotification = await ActiveDocNotificationRepository.save(
    notification
  );

  // send notification to forwardToId
  const socketInstance = SocketService.getInstance();
  if (socketInstance.isUserOnline(forwardToId)) {
    socketInstance.emitToUser(forwardToId, NotificationEvent.ForwardActiveDoc, {
      notification: savedNotification,
    });
  }
}

async function acknowledgeForwardedActiveDocument(
  req: AuthRequest,
  res: Response
) {
  const { transactionId } = req.params;
  const user = req.user;

  const holder = await UserRepository.findOne({
    where: { userId: user.userId },
  });
  if (!holder) {
    res.status(404).json({
      message: "No usr with userId",
    });
    return;
  }

  const transaction = await ActiveDocTransactionRepository.findOne({
    where: {
      transactionId,
      state: ActiveDocTransactionState.SENT,
      acknowledged: false,
    },
  });

  if (!transaction) {
    res.status(404).json({
      message: "Transaction for active doc not found",
    });
    return;
  }

  const activeDoc = await ActiveDocRepository.findOne({
    where: { activeDocId: transaction.activeDocId },
  });
  if (!activeDoc) {
    res.status(404).json({
      message: "No active doc associated with transaction",
    });
    return;
  }
  // acknowledge transaction for sent state
  transaction.acknowledged = true;
  await ActiveDocTransactionRepository.save(transaction);

  await ActiveDocTransactionRepository.update(
    {
      transactionId,
      state: ActiveDocTransactionState.SENT,
      acknowledged: false,
    },
    { acknowledged: true }
  );

  // new transaction for acknowledged state
  const ackTransaction = new ActiveDocTransaction();
  ackTransaction.transactionId = uuidv4();
  ackTransaction.acknowledged = true;
  ackTransaction.sourceId = user.userId;
  ackTransaction.forwardedToId = transaction.sourceId;
  ackTransaction.comments = "Acknowledged";
  ackTransaction.activeDocId = transaction.activeDocId;
  ackTransaction.forwardedAt = new Date();
  ackTransaction.state = ActiveDocTransactionState.ACKNOWLEDGED;
  const savedTransaction = await ActiveDocTransactionRepository.save(
    ackTransaction
  );

  const newTransaction = await ActiveDocTransactionRepository.findOne({
    where: {
      transactionId: savedTransaction.transactionId,
    },
    relations: {
      activeDoc: true,
      source: true,
      forwardedTo: true,
    },
  });

  if (!newTransaction) {
    res.status(404).json({
      message: "New transaction not found",
    });
    return;
  }

  // send notification to source of receiver's acknowledgement
  const notification = new ActiveDocNotification();
  notification.notificationId = uuidv4();
  notification.transactionId = savedTransaction.transactionId;
  notification.message = `${user.name} acknowledged receiving ${
    newTransaction.activeDoc.subject
  } from ${newTransaction.source.name} at ${new Date().toISOString()}`;
  notification.senderId = user.userId;
  notification.receiverId = newTransaction.sourceId;
  const savedNotification = await ActiveDocNotificationRepository.save(
    notification
  );

  if (SocketService.getInstance().isUserOnline(newTransaction!.sourceId)) {
    SocketService.getInstance().emitToUser(
      newTransaction.sourceId,
      NotificationEvent.AcknowledgeActiveDoc,
      {
        notification: savedNotification,
      }
    );
  }

  // mark notification for sent transaction as read
  const notificationToRead = await ActiveDocNotificationRepository.findOne({
    where: { transactionId },
  });
  if (!notificationToRead) {
    res.status(404).json({
      message: "Notification for sent transaction not found",
    });
    return;
  }
  notificationToRead.read = true;
  await ActiveDocNotificationRepository.save(notificationToRead);

  await ActiveDocNotificationRepository.update(
    { transactionId },
    { read: true }
  );

  res.status(200).json({
    message: "Acknowledged ",
    transaction: newTransaction,
  });
}

async function returnForwardedActiveDocument(req: AuthRequest, res: Response) {
  const { transactionId } = req.params;
  const { comments } = req.body;

  const user = req.user;

  const transaction = await ActiveDocTransactionRepository.findOne({
    where: {
      transactionId,
      state: ActiveDocTransactionState.SENT,
      acknowledged: false,
    },
    relations: {
      source: true,
    },
  });

  if (!transaction) {
    res.status(404).json({
      message: "Transaction for active doc not found",
    });
    return;
  }

  // acknowledge transaction for sent state
  await ActiveDocTransactionRepository.update(
    {
      transactionId,
      state: ActiveDocTransactionState.SENT,
      acknowledged: false,
    },
    { acknowledged: true }
  );

  transaction.acknowledged = true;
  await ActiveDocTransactionRepository.save(transaction);

  // mark sent notification as read
  const notificationToRead = await ActiveDocNotificationRepository.findOne({
    where: { transactionId },
  });

  if (!notificationToRead) {
    res.send(404).json({
      message: "No notification to read",
    });
    return;
  }

  notificationToRead.read = true;
  await ActiveDocNotificationRepository.save(notificationToRead);

  await ActiveDocNotificationRepository.update(
    { transactionId },
    { read: true }
  );
  console.log(`Read notification for ${transactionId}, returned`);

  // new transaction for returned state
  const ackTransaction = new ActiveDocTransaction();
  ackTransaction.transactionId = uuidv4();
  ackTransaction.acknowledged = true;
  ackTransaction.forwardedToId = transaction.sourceId;
  ackTransaction.sourceId = transaction.forwardedToId;
  ackTransaction.comments = comments;
  ackTransaction.activeDocId = transaction.activeDocId;
  ackTransaction.forwardedAt = new Date();
  ackTransaction.state = ActiveDocTransactionState.RETURNED;
  const savedTransaction = await ActiveDocTransactionRepository.save(
    ackTransaction
  );

  await ActiveDocRepository.update(
    { activeDocId: transaction.activeDocId },
    { currentHolderId: transaction.sourceId }
  );

  const newTransaction = await ActiveDocTransactionRepository.findOne({
    where: {
      transactionId: savedTransaction.transactionId,
    },
    relations: {
      activeDoc: true,
      source: true,
      forwardedTo: true,
    },
  });

  if (!newTransaction) {
    res.status(404).json({
      message: "New transaction not found",
    });
    return;
  }

  // send notification to original sender that document has been returned
  const notification = new ActiveDocNotification();
  notification.notificationId = uuidv4();
  notification.transactionId = savedTransaction.transactionId;
  notification.message = `${user.name} returned ${
    newTransaction.activeDoc.subject
  } to ${
    transaction.source.name
  } at ${new Date().toISOString()} with comments ${comments}`;
  notification.senderId = user.userId;
  notification.receiverId = transaction.sourceId;
  const savedNotification = await ActiveDocNotificationRepository.save(
    notification
  );

  if (SocketService.getInstance().isUserOnline(transaction!.sourceId)) {
    SocketService.getInstance().emitToUser(
      transaction.sourceId,
      NotificationEvent.ReturnActiveDoc,
      {
        notification: savedNotification,
      }
    );
  }

  res.status(200).json({
    message: "Returned",
    transaction: newTransaction,
  });
}

async function acknowledgeForwardedActiveDocuments(
  req: AuthRequest,
  res: Response
) {
  const { transactionIds } = req.body;
  const user = req.user;

  const acknowledgedPromise = transactionIds.map(
    async (transactionId: string) => {
      const activeDocTransaction = await ActiveDocTransactionRepository.findOne(
        {
          where: { transactionId, acknowledged: false },
          relations: {
            activeDoc: true,
          },
        }
      );
      if (!activeDocTransaction) {
        res.status(404).json({
          message: "Unacknowledged active doc with id provided not found",
        });
        return;
      }

      activeDocTransaction.acknowledged = true;
      await ActiveDocTransactionRepository.update(
        { transactionId, acknowledged: false },
        { acknowledged: true }
      );

      // create new transaction for acknowledgement
      const ackTransaction = new ActiveDocTransaction();
      ackTransaction.transactionId = uuidv4();
      ackTransaction.acknowledged = true;
      ackTransaction.sourceId = activeDocTransaction.sourceId;
      ackTransaction.forwardedToId = activeDocTransaction.forwardedToId;
      ackTransaction.comments = "Acknowledged";
      ackTransaction.activeDocId = activeDocTransaction.activeDocId;
      ackTransaction.forwardedAt = activeDocTransaction.forwardedAt;
      ackTransaction.state = ActiveDocTransactionState.ACKNOWLEDGED;
      await ActiveDocTransactionRepository.save(ackTransaction);

      // send notification to sender
      const notification = new ActiveDocNotification();
      notification.notificationId = uuidv4();
      notification.transactionId = transactionId;
      notification.senderId = user.userId;
      notification.receiverId = activeDocTransaction.sourceId;
      notification.message = `${user.name} acknowledged receiving ${
        activeDocTransaction.activeDoc.subject
      } at ${new Date().toUTCString()}`;
      const savedNotification = await ActiveDocNotificationRepository.save(
        notification
      );

      if (
        SocketService.getInstance().isUserOnline(activeDocTransaction.sourceId)
      ) {
        SocketService.getInstance().emitToUser(
          activeDocTransaction.sourceId,
          NotificationEvent.ArchiveRequest,
          {
            notification: savedNotification,
          }
        );
      }

      const notificationToRead = await ActiveDocNotificationRepository.findOne({
        where: { transactionId },
      });

      if (!notificationToRead) {
        res.send(404).json({
          message: "No notification to read",
        });
        return;
      }

      notificationToRead.read = true;
      await ActiveDocNotificationRepository.save(notificationToRead);

      await ActiveDocNotificationRepository.update(
        { transactionId },
        { read: true }
      );

      return transactionId;
    }
  );

  Promise.all(acknowledgedPromise).then((r) => {
    const acknowledgedTransactions = r.filter((transactionId) => transactionId);
    const failedAcknowledgements = transactionIds.filter(
      (transaction: string) => !acknowledgedTransactions.includes(transaction)
    );

    res.status(200).json({
      message: "Acknowledged forwarded active document",
      failedAcknowledgements,
    });
  });
}

async function getActiveDocsPendingAcknowledgements(
  req: AuthRequest,
  res: Response
) {
  const user = req.user;
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);

  const [acknowledgements, total] =
    await ActiveDocTransactionRepository.findAndCount({
      where: [
        {
          acknowledged: false,
          forwardedToId: user.userId,
          state: ActiveDocTransactionState.SENT,
          source: { name: ILike(`%${search}%`) },
        },
        {
          acknowledged: false,
          forwardedToId: user.userId,
          state: ActiveDocTransactionState.SENT,
          activeDoc: { subject: ILike(`%${search}%`) },
        },
        {
          acknowledged: false,
          forwardedToId: user.userId,
          state: ActiveDocTransactionState.SENT,
          activeDoc: { referenceNumber: ILike(`%${search}%`) },
        },
      ],
      relations: {
        activeDoc: true,
        source: true,
      },
      take: pageSize,
      skip: startNumber - 1,
    });

  const end = Math.min(startNumber + pageSize - 1, total);

  res.status(200).json({
    message: "Active docs retrieved",
    acknowledgements,
    meta: {
      total,
      start,
      end,
    },
  });
}

export {
  getActiveDocById,
  getAllActiveDocs,
  addActiveDoc,
  forwardActiveDoc,
  acknowledgeForwardedActiveDocument,
  acknowledgeForwardedActiveDocuments,
  getActiveDocsPendingAcknowledgements,
  returnForwardedActiveDocument,
};
