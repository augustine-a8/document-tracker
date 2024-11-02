import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { CustodyHistory, Document } from "../entity";

const CustodyHistoryRepository = AppDataSource.getRepository(CustodyHistory);
const DocumentRepository = AppDataSource.getRepository(Document);

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

export { getCustodyHistoryForDocument, getAllCustodyHistory };
