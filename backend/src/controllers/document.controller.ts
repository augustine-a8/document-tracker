import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../data-source";
import { Document, User, CustodyHistory } from "../entity";
import { AuthRequest } from "../@types/authRequest";

const DocumentRepository = AppDataSource.getRepository(Document);
const UserRepository = AppDataSource.getRepository(User);
const CustodyHistoryRepository = AppDataSource.getRepository(CustodyHistory);

async function getAllDocuments(req: Request, res: Response) {
  const allDocuments = await DocumentRepository.find({});

  res.status(200).json({
    message: "Retrieved all documents",
    allDocuments,
  });
}

async function getDocumentById(req: Request, res: Response) {
  const { id: documentId } = req.params;
  const document = await DocumentRepository.findOne({
    where: { documentId },
    relations: { currentHolder: true, custodyHistories: true },
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

  const history = new CustodyHistory();
  history.historyId = uuidv4();
  history.documentId = documentId;
  history.senderId = senderId;
  history.sentTimestamp = new Date();
  history.comment = comment;
  history.receiverId = receiverId;

  const savedHistory = await CustodyHistoryRepository.save(history);
  const newHistory = await CustodyHistoryRepository.findOne({
    where: { historyId: savedHistory.historyId },
    relations: {
      sender: true,
      receiver: true,
    },
  });

  res.status(200).json({
    message: "Document sent successfully",
    history: newHistory,
  });
}

// TODO: Ackowlege document route kinda messed up
async function acknowledgeDocument(req: AuthRequest, res: Response) {
  const { historyId } = req.body;
  if (!historyId) {
    res.status(400).json({
      message: "Document history for transaction should be provided",
    });
    return;
  }

  const history = await CustodyHistory.findOneBy({ historyId });
  if (!history) {
    res.status(404).json({
      message: "Document history for transaction not found",
    });
    return;
  }

  const receiverId = history.receiverId;
  const userId = req.user.userId;
  if (userId !== receiverId) {
    res.status(403).json({
      message:
        "Action not allowed. Only intended receiver can acknowledge receiving document",
    });
    return;
  }

  const documentId = history.documentId;
  const document = await DocumentRepository.findOneBy({ documentId });

  if (!document) {
    res.status(404).json({
      message: "Document used in transaction not found",
    });
    return;
  }

  history.acknowledgedTimestamp = new Date();
  document.currentHolderId = receiverId;

  const savedHistory = await CustodyHistoryRepository.save(history);
  await DocumentRepository.save(document);

  res.status(200).json({
    message: "Acknowledged receiving document",
    history: savedHistory,
  });
}

export {
  getAllDocuments,
  getDocumentById,
  addDocument,
  // updateDocument,
  sendDocument,
  acknowledgeDocument,
};
