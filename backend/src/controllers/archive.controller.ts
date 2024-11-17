import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AuthRequest } from "../@types/authRequest";
import { AppDataSource } from "../data-source";
import {
  ArchiveDocument,
  ArchiveNotification,
  ArchiveTransaction,
  User,
} from "../entity";
import { SocketService } from "../services/SocketService";

const ArchiveDocumentRepository = AppDataSource.getRepository(ArchiveDocument);
const ArchiveTransactionRepository =
  AppDataSource.getRepository(ArchiveTransaction);
const ArchiveNotificationRepository =
  AppDataSource.getRepository(ArchiveNotification);

async function addArchivedDocument(req: AuthRequest, res: Response) {
  const { title, location, type, serialNumber } = req.body;

  if (!title || !location || !type || !serialNumber) {
    res.status(400).json({
      message: "Request props not complete",
    });
    return;
  }

  const archiveDocument = new ArchiveDocument();
  archiveDocument.documentId = uuidv4();
  archiveDocument.title = title;
  archiveDocument.type = type;
  archiveDocument.serialNumber = serialNumber;
  archiveDocument.location = location;

  const newArchiveDocument = await ArchiveDocumentRepository.save(
    archiveDocument
  );

  res.status(200).json({
    message: "New archive document added",
    archiveDocument: newArchiveDocument,
  });
}

async function getAllArchivedDocuments(req: Request, res: Response) {
  const allArchivedDocuments = await ArchiveDocument.find({});

  res.status(200).json({
    message: "All archived documents retrieved",
    allArchivedDocuments,
  });
}

async function getArchivedDocumentById(req: Request, res: Response) {
  const { id: archiveDocumentId } = req.params;

  if (!archiveDocumentId) {
    res.status(400).json({
      message: "Archive document id should be provided",
    });
    return;
  }

  const archivedDocument = await ArchiveDocument.findOne({
    where: { documentId: archiveDocumentId },
  });
  if (!archivedDocument) {
    res.status(404).json({
      message: "Archive document with id provided not found",
    });
    return;
  }

  res.status(200).json({
    message: "Archive document retrieved",
    archivedDocument,
  });
}

async function requestForArchivedDocument(req: AuthRequest, res: Response) {
  const { id: archiveDocumentId } = req.params;
  const { requestApproverId, comment } = req.body;

  if (!archiveDocumentId) {
    res.status(400).json({
      messge: "Archive document id should be provided",
    });
    return;
  }

  if (!requestApproverId) {
    res.status(400).json({
      message: "Requests for archive documents need to be approved",
    });
    return;
  }

  if (!comment) {
    res.status(400).json({
      message: "Comment is required",
    });
    return;
  }

  const archivedDocument = await ArchiveDocumentRepository.findOne({
    where: { documentId: archiveDocumentId },
  });
  if (!archivedDocument) {
    res.status(404).json({
      message: "Archive document with id provided not found",
    });
    return;
  }

  const user = req.user;
  const archiveTransaction = new ArchiveTransaction();
  archiveTransaction.transactionId = uuidv4();
  archiveTransaction.documentId = archiveDocumentId;
  archiveTransaction.requesterId = user.userId;
  archiveTransaction.requestedAt = new Date();
  archiveTransaction.requestApproverId = requestApproverId;
  archiveTransaction.comment = comment;

  const savedTransaction = await ArchiveTransactionRepository.save(
    archiveTransaction
  );
  const newTransaction = await ArchiveTransactionRepository.findOne({
    where: { transactionId: savedTransaction.transactionId },
    relations: {
      requester: true,
      document: true,
      requestApprover: true,
    },
  });

  // create new notification item for transaction
  const notification = new ArchiveNotification();
  notification.notificationId = uuidv4();
  notification.transactionId = newTransaction!.transactionId;
  notification.notificationType = "archive_document_request";

  const newNotification = await ArchiveNotificationRepository.save(
    notification
  );

  // Send notification to request approver to approve/cancel requester's request
  if (SocketService.getInstance().isUserOnline(requestApproverId)) {
    SocketService.getInstance().emitToUser(
      requestApproverId,
      "archive_document_request",
      {
        ...newNotification,
        transaction: newTransaction,
      }
    );
  }

  res.status(200).json({
    message: "Request pending approval",
    transaction: newTransaction,
  });
}

// This controller is for getting all user's request for archive documents(transactions)
async function getAllArchivedDocumentRequest(req: AuthRequest, res: Response) {
  const user = req.user;

  const allUserArchiveRequests = await ArchiveTransactionRepository.find({
    where: { requesterId: user.userId },
    relations: {
      document: true,
      requestApprover: true,
    },
  });

  res.status(200).json({
    message: "All user transactions retrieved",
    allUserArchiveRequests,
  });
}

// This controller is for the HOD to approve/reject the request for the archived document
async function approveRequestForArchivedDocument(
  req: AuthRequest,
  res: Response
) {
  const { id: archiveTransactionId } = req.params;
  const { approveRequest } = req.body; // approveRequest is a boolean indicating whether or not request for archive document has been approved

  if (!archiveTransactionId) {
    res.status(400).json({
      message: "Archive transaction should be provided",
    });
    return;
  }

  if (!approveRequest) {
    res.status(400).json({
      message: "Archive transaction request should be approved/cancelled",
    });
    return;
  }

  const archiveTransaction = await ArchiveTransactionRepository.findOne({
    where: { transactionId: archiveTransactionId },
    relations: {
      requestApprover: true,
      document: true,
      requester: true,
    },
  });

  if (!archiveTransaction) {
    res.status(404).json({
      message: "Invalid archive transaction id",
    });
    return;
  }

  if (approveRequest) {
    archiveTransaction.status = "approved";
  } else {
    archiveTransaction.status = "rejected";
  }

  await ArchiveTransactionRepository.save(archiveTransaction);

  res.status(200).json({
    message: "Transaction request approval status saved",
  });

  const notification = new ArchiveNotification();
  notification.notificationId = uuidv4();
  notification.transactionId = archiveTransactionId;
  notification.notificationType = "request_approval";

  const newNotification = await ArchiveNotificationRepository.save(
    notification
  );

  const transaction = await ArchiveTransactionRepository.findOne({
    where: { transactionId: newNotification.transactionId },
    relations: {
      document: true,
      requestApprover: true,
      requester: true,
    },
  });

  // send notification to reqeuster concerning the status of their archive document request
  if (
    SocketService.getInstance().isUserOnline(archiveTransaction.requesterId)
  ) {
    SocketService.getInstance().emitToUser(
      archiveTransaction.requesterId,
      "request_approval",
      {
        ...newNotification,
        transaction,
      }
    );
  }
}

async function acceptRequestForArchivedDocument(
  req: AuthRequest,
  res: Response
) {
  // ids is a list of transaction ids to be fulfilled by archiver
  const { ids: archiveTransactionIds } = req.body;

  if (!archiveTransactionIds) {
    res.status(400).json({
      message: "Archive transaction id should be provided",
    });
    return;
  }

  archiveTransactionIds.forEach(async (archiveTransactionId: any) => {
    const transaction = await ArchiveTransactionRepository.findOne({
      where: { transactionId: archiveTransactionId, status: "approved" },
    });
    if (!transaction) {
      console.log("No approved transaction for id provided");
      return;
    }
    transaction.status = "accepted";
    await ArchiveTransactionRepository.save(transaction);
    // TODO: send notification to requester that their request has been accepted
  });

  res.status(200).json({
    message: "All requests for archive documents accepted",
  });
}

async function getAllUserRequestsForDocument(req: AuthRequest, res: Response) {
  const { id: documentId } = req.params;

  if (!documentId) {
    res.status(400).json({
      message: "Document id should be provided",
    });
    return;
  }

  const user = req.user;

  const allUserRequests = await ArchiveTransactionRepository.find({
    where: { requesterId: user.userId, documentId: documentId },
    relations: {
      requestApprover: true,
    },
  });

  res.status(200).json({
    message: "All user requests for document retrieved",
    allUserRequests,
  });
}

async function getRequestsPendingHODApproval(req: AuthRequest, res: Response) {
  const user = req.user;
  if (user.role !== "HOD") {
    res.status(403).json({
      message: "User is unauthorized",
    });
    return;
  }

  const allRequests = await ArchiveTransactionRepository.find({
    where: { status: "submitted", requestApproverId: user.userId },
    relations: {
      document: true,
      requester: true,
    },
  });

  res.status(200).json({
    message: "All requests pending HOD approval retrieved",
    requestsPendingApproval: allRequests,
  });
}

async function getApprovedRequestsPendingArchiverAcceptance(
  req: AuthRequest,
  res: Response
) {
  const user = req.user;

  if (user.role !== "archiver") {
    res.status(403).json({
      message: "User is unauthorized",
    });
    return;
  }

  const allRequests = await ArchiveTransactionRepository.find({
    where: { status: "approved" },
    relations: {
      document: true,
      requester: true,
      requestApprover: true,
    },
  });

  res.status(200).json({
    message: "Approved requests pending acceptance retrieved",
    requestsPendingAcceptance: allRequests,
  });
}

export {
  addArchivedDocument,
  getAllArchivedDocuments,
  getArchivedDocumentById,
  requestForArchivedDocument,
  approveRequestForArchivedDocument,
  getAllArchivedDocumentRequest,
  acceptRequestForArchivedDocument,
  getAllUserRequestsForDocument,
  getRequestsPendingHODApproval,
  getApprovedRequestsPendingArchiverAcceptance,
};
