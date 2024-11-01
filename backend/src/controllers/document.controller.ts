import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../data-source";
import { Document, User, CustodyHistory } from "../entity";

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
  const { id: document_id } = req.params;
  const document = await DocumentRepository.findOne({
    where: { document_id },
    relations: { current_holder: true, custodyHistories: true },
  });

  if (!document) {
    res.status(404).json({
      message: "Document does not exist",
      document: null,
    });
  } else {
    res.status(200).json({
      message: "Document retrieved",
      document,
    });
  }
}

async function addDocument(req: Request, res: Response) {
  const { title, description, serialNumber } = req.body;

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

  const existingDocument = await DocumentRepository.findOneBy({
    serial_number: serialNumber,
  });
  if (existingDocument) {
    res.status(400).json({
      message: "Document with serial number already exists",
    });
    return;
  }

  const document = new Document();
  document.document_id = uuidv4();
  document.title = title;
  document.description = description ? description : "";
  document.serial_number = serialNumber;

  const newDocument = await DocumentRepository.save(document);

  res.status(200).json({
    message: "New document added",
    newDocument,
  });
}

async function updateDocument(req: Request, res: Response) {
  const { id: document_id } = req.params;
  const { title, description, serialNumber } = req.body;

  const document = await DocumentRepository.findOneBy({ document_id });
  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
      document: null,
    });
    return;
  }

  if (title) {
    document.title = title;
  }
  if (description) {
    document.description = description;
  }
  if (serialNumber) {
    document.serial_number = serialNumber;
  }

  const updatedDocument = await DocumentRepository.save(document);

  res.status(200).json({
    message: "Document updated successfully",
    document: updatedDocument,
  });
}

async function transferDocumentCustody(req: Request, res: Response) {
  const { id: document_id } = req.params;
  const { newHolderId, comment } = req.body;

  if (!newHolderId) {
    res.status(400).json({
      message: "Document receiver must be provided",
      custodyHistory: null,
    });
    return;
  }

  const document = await DocumentRepository.findOneBy({ document_id });

  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
      custodyHistory: null,
    });
    return;
  }

  const newHolder = await UserRepository.findOneBy({ user_id: newHolderId });
  const previousHolderId = document.current_holder_id;

  if (!newHolder) {
    res.status(404).json({
      message: "New holder of document not found",
      custodyHistory: null,
    });
    return;
  }

  const history = new CustodyHistory();
  history.history_id = uuidv4();
  history.document_id = document_id;
  history.current_holder_id = newHolderId;
  history.timestamp = new Date();
  history.comment = comment ? comment : "";
  if (document.status === "assigned") {
    history.previous_holder_id = previousHolderId;
  }

  document.current_holder_id = newHolderId;
  if (document.status === "available") {
    document.status = "assigned";
  }

  await CustodyHistoryRepository.save(history);
  const savedDocument = await DocumentRepository.save(document);

  res.status(200).json({
    message: "Document custody transfer successful",
    document: savedDocument,
  });
}

export {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  transferDocumentCustody,
};
