import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { ActiveDoc } from "../entities/ActiveDoc.new";
import { ActiveDocTransaction } from "../entities/ActiveDocTransaction.new";
import { User } from "../entities";
import { AuthRequest } from "../@types/authRequest";
import { AppDataSource } from "../data-source";
import { ActiveDocTransactionState } from "../@types/activeDocTransaction";
import { SocketService } from "../services/SocketService";
import { NotificationEvent } from "../@types/notification";
import { ActiveDocTransactionStateHistory } from "../entities/ActiveDocTransactionStateHistory";
import { ActiveDocNotification } from "../entities/ActiveDocNotification.new";

const ActiveDocRepo = AppDataSource.getRepository(ActiveDoc);
const ActiveDocTransactionRepo =
  AppDataSource.getRepository(ActiveDocTransaction);
const ActiveDocNotificationRepo = AppDataSource.getRepository(
  ActiveDocNotification
);
const TransactionStateRepo = AppDataSource.getRepository(
  ActiveDocTransactionStateHistory
);
const UserRepo = AppDataSource.getRepository(User);

async function addNewDoc(req: AuthRequest, res: Response) {
  const { subject, referenceNumber } = req.body;

  const existingDoc = await ActiveDocRepo.find({ where: { referenceNumber } });
  if (existingDoc.length > 0) {
    res.status(400).json({
      message: "Doc with reference number already exists",
    });
    return;
  }

  const userId = req.user.userId;

  const user = await UserRepo.findOne({ where: { userId } });
  if (!user) {
    res.status(404).json({
      message: "You do not exist",
    });
    return;
  }

  const doc = new ActiveDoc();
  doc.activeDocId = uuidv4();
  doc.subject = subject;
  doc.referenceNumber = referenceNumber;
  doc.originatorId = userId;
  doc.currentHolderId = userId;
  doc.previousHolders = [user];
  const savedDoc = await doc.save();

  res.status(200).json({
    message: "New active doc saved",
    activeDoc: savedDoc,
  });
}

async function forwardDoc(req: AuthRequest, res: Response) {
  const { id: activeDocId } = req.params;
  const { forwardToId, comment } = req.body;

  const doc = await ActiveDocRepo.findOne({ where: { activeDocId } });
  if (!doc) {
    res.status(404).json({
      message: "No active doc with id provided",
    });
    return;
  }

  const forwardedTo = await UserRepo.findOne({
    where: { userId: forwardToId },
  });
  if (!forwardedTo) {
    res.status(404).json({
      message: "User with forward to id not found",
    });
    return;
  }

  const senderId = req.user.userId;
  const sender = await UserRepo.findOne({ where: { userId: senderId } });
  if (!sender) {
    res.status(404).json({
      message: "User does not exist",
    });
    return;
  }

  doc.currentHolderId = forwardedTo.userId;
  const savedDoc = await doc.save();

  const transaction = new ActiveDocTransaction();
  transaction.transactionId = uuidv4();
  transaction.activeDocId = doc.activeDocId;
  transaction.sourceId = sender.userId;
  transaction.forwardedToId = forwardedTo.userId;
  const savedTransaction = await transaction.save();

  const transactionStateHistory = new ActiveDocTransactionStateHistory();
  transactionStateHistory.stateHistoryId = uuidv4();
  transactionStateHistory.comment = comment;
  transactionStateHistory.transactionId = savedTransaction.transactionId;
  transactionStateHistory.state = ActiveDocTransactionState.SENT;
  transactionStateHistory.date = new Date();
  await transactionStateHistory.save();

  const notification = new ActiveDocNotification();
  notification.notificationId = uuidv4();
  notification.transactionStateHistoryId =
    transactionStateHistory.stateHistoryId;
  notification.senderId = sender.userId;
  notification.receiverId = forwardedTo.userId;
  notification.message = `${sender.name} sent ${
    savedDoc.subject
  } with reference number ${
    savedDoc.referenceNumber
  } at ${new Date().toISOString()} with comment ${comment}`;
  notification.read = false;
  const savedNotification = await notification.save();

  const socket = SocketService.getInstance();
  const receiverId = forwardedTo.userId;
  if (socket.isUserOnline(receiverId)) {
    socket.emitToUser(receiverId, NotificationEvent.ForwardActiveDoc, {
      notification: savedNotification,
    });
  }

  res.status(200).json({
    message: "Doc forwarded",
    activeDoc: savedDoc,
    transaction: savedTransaction,
  });
}

async function acknowledgeMultipleDocs(req: AuthRequest, res: Response) {
  const { transactionAcknowledgements } = req.body;

  transactionAcknowledgements.forEach(
    async (transactionAcknowledgement: {
      sentTransactionId: string;
      stateHistoryId: string;
    }) => {
      const { sentTransactionId, stateHistoryId } = transactionAcknowledgement;

      const transaction = await ActiveDocTransactionRepo.findOne({
        where: { transactionId: sentTransactionId },
      });
      if (!transaction) {
        return;
      }

      if (transaction.forwardedToId !== req.user.userId) {
        res.status(403).json({
          message: "Action not allowed",
        });
        return;
      }

      const transactionDocId = transaction.activeDocId;
      const doc = await ActiveDoc.findOneOrFail({
        where: { activeDocId: transactionDocId },
        relations: { previousHolders: true },
      });

      const transactionStateHistory = new ActiveDocTransactionStateHistory();
      transactionStateHistory.stateHistoryId = uuidv4();
      transactionStateHistory.transactionId = transaction.transactionId;
      transactionStateHistory.state = ActiveDocTransactionState.ACKNOWLEDGED;
      transactionStateHistory.comment = "Acknowledged receiving document";
      transactionStateHistory.date = new Date();
      const savedHistory = await transactionStateHistory.save();

      await ActiveDocNotificationRepo.update(
        { transactionStateHistoryId: stateHistoryId },
        { read: true }
      );

      const sender = await UserRepo.findOneOrFail({
        where: { userId: req.user.userId },
      });

      const receiver = await UserRepo.findOneOrFail({
        where: { userId: transaction.sourceId },
      });

      if (
        !doc.previousHolders.some((holder) => holder.userId === req.user.userId)
      ) {
        doc.previousHolders = [sender];
        await doc.save();
      }

      const notification = new ActiveDocNotification();
      notification.notificationId = uuidv4();
      notification.transactionStateHistoryId = savedHistory.stateHistoryId;
      notification.senderId = sender.userId;
      notification.receiverId = receiver.userId;
      notification.message = `${sender.name} acknowledged receiving ${
        doc.subject
      } with reference number ${doc.referenceNumber} forwarded from ${
        receiver.name
      } at ${new Date().toISOString()}`;
      notification.read = false;
      const savedNotification = await notification.save();

      const socket = SocketService.getInstance();
      if (socket.isUserOnline(receiver.userId)) {
        socket.emitToUser(
          receiver.userId,
          NotificationEvent.AcknowledgeActiveDoc,
          {
            notification: savedNotification,
          }
        );
      }
    }
  );

  res.status(200).json({
    message: "Multiple documents acknowledged",
  });
}

async function returnDoc(req: AuthRequest, res: Response) {
  const { transactionReturned } = req.body;

  const { sentTransactionId, stateHistoryId } = transactionReturned;

  const transaction = await ActiveDocTransactionRepo.findOneOrFail({
    where: { transactionId: sentTransactionId },
  });

  const transactionDocId = transaction.activeDocId;
  const doc = await ActiveDoc.findOneOrFail({
    where: { activeDocId: transactionDocId },
  });

  const transactionStateHistory = new ActiveDocTransactionStateHistory();
  transactionStateHistory.stateHistoryId = uuidv4();
  transactionStateHistory.comment = "Document was not received";
  transactionStateHistory.transactionId = transaction.transactionId;
  transactionStateHistory.state = ActiveDocTransactionState.RETURNED;
  transactionStateHistory.date = new Date();
  const savedHistory = await transactionStateHistory.save();

  await ActiveDocNotificationRepo.update(
    { transactionStateHistoryId: stateHistoryId },
    { read: true }
  );

  const sender = await UserRepo.findOneOrFail({
    where: { userId: req.user.userId },
  });
  const receiver = await UserRepo.findOneOrFail({
    where: { userId: transaction.sourceId },
  });

  doc.currentHolderId = receiver.userId;
  await doc.save();

  const notification = new ActiveDocNotification();
  notification.notificationId = uuidv4();
  notification.transactionStateHistoryId = savedHistory.stateHistoryId;
  notification.senderId = sender.userId;
  notification.receiverId = receiver.userId;
  notification.message = `${sender.name} returned ${
    doc.subject
  } with reference number ${doc.referenceNumber} forwarded from ${
    receiver.name
  } at ${new Date().toISOString()} with comment ${savedHistory.comment}`;
  notification.read = false;
  const savedNotification = await notification.save();

  const socket = SocketService.getInstance();
  if (socket.isUserOnline(receiver.userId)) {
    socket.emitToUser(receiver.userId, NotificationEvent.AcknowledgeActiveDoc, {
      notification: savedNotification,
    });
  }

  res.status(200).json({
    message: "Active doc returned",
    history: savedHistory,
  });
}

async function getAllDocs(req: AuthRequest, res: Response) {
  const userId = req.user.userId;
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const searchTerm = search as string;

  const [docs, total] = await ActiveDocRepo.createQueryBuilder("doc")
    .innerJoin("doc.previousHolders", "previousHolders")
    .where("previousHolders.userId = :userId", { userId })
    .orWhere("doc.currentHolderId = :userId", { userId })
    .orWhere("doc.originatorId = :userId", { userId })
    .skip(startNumber - 1)
    .take(pageSize)
    .getManyAndCount();

  const end = Math.min(total, startNumber + pageSize - 1);

  res.status(200).json({
    message: "Previously held documents retrieved",
    activeDocs: docs,
    meta: {
      total,
      start: startNumber,
      end,
    },
  });
}

async function getDocById(req: AuthRequest, res: Response) {
  const { id: activeDocId } = req.params;
  const userId = req.user.userId;

  const activeDoc = await ActiveDocRepo.findOne({
    where: {
      activeDocId,
    },
    relations: {
      currentHolder: true,
      originator: true,
    },
  });

  const transactions = await ActiveDocTransactionRepo.find({
    where: { activeDocId },
    relations: {
      source: true,
      forwardedTo: true,
      stateHistories: true,
    },
    order: { stateHistories: { date: "DESC" } },
  });

  const sentNotAcknowledgedTransaction =
    await ActiveDocTransactionRepo.createQueryBuilder("transaction")
      .innerJoinAndSelect("transaction.stateHistories", "stateHistory")
      .innerJoin("transaction.activeDoc", "activeDoc")
      .where("activeDoc.activeDocId = :activeDocId", { activeDocId })
      .andWhere("transaction.forwardedToId = :userId", { userId })
      .andWhere("stateHistory.state = :sentState", {
        sentState: ActiveDocTransactionState.SENT,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("stateHistory.transactionId")
          .from(ActiveDocTransactionStateHistory, "stateHistory")
          .where("stateHistory.state = :acknowledgedState")
          .orWhere("stateHistory.state = :returnedState")
          .getQuery();
        return `transaction.transactionId NOT IN ${subQuery}`;
      })
      .setParameter("acknowledgedState", ActiveDocTransactionState.ACKNOWLEDGED)
      .setParameter("returnedState", ActiveDocTransactionState.RETURNED)
      .getOne();

  res.status(200).json({
    message: "Active doc retrieved",
    activeDoc,
    transactions,
    unacknowledgedTransaction: sentNotAcknowledgedTransaction,
  });
}

async function getPendingAcknowledgements(req: AuthRequest, res: Response) {
  const { start = 1, limit = 10, search = "" } = req.query;
  const startNumber = parseInt(start as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const searchTerm = search as string;

  const userId = req.user.userId;

  const [docsPendingAcknowledgement, total] =
    await ActiveDocRepo.createQueryBuilder("activeDoc")
      .innerJoinAndSelect("activeDoc.transactions", "transaction")
      .innerJoinAndSelect("transaction.stateHistories", "stateHistory")
      .innerJoinAndSelect("transaction.source", "source")
      .innerJoinAndSelect("transaction.forwardedTo", "forwardedTo")
      .where("transaction.forwardedToId = :userId", { userId })
      .andWhere("stateHistory.state = :sentState", {
        sentState: ActiveDocTransactionState.SENT,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("stateHistory.transactionId")
          .from(ActiveDocTransactionStateHistory, "stateHistory")
          .where("stateHistory.state = :acknowledgedState")
          .orWhere("stateHistory.state = :returnedState")
          .getQuery();
        return `transaction.transactionId NOT IN ${subQuery}`;
      })
      .setParameters({
        acknowledgedState: ActiveDocTransactionState.ACKNOWLEDGED,
        returnedState: ActiveDocTransactionState.RETURNED,
      })
      .skip(startNumber - 1)
      .take(pageSize)
      .getManyAndCount();

  res.status(200).json({
    message: "Pending acknowledgements retrieved",
    pendingAcknowledgements: docsPendingAcknowledgement,
    meta: {
      start: startNumber,
      total,
      end: Math.min(total, startNumber + pageSize - 1),
    },
  });
}

export {
  addNewDoc,
  forwardDoc,
  acknowledgeMultipleDocs,
  returnDoc,
  getAllDocs,
  getDocById,
  getPendingAcknowledgements,
};
