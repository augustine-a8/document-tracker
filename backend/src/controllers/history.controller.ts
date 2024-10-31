import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { CustodyHistory, Document } from "../entity";

const CustodyHistoryRepository = AppDataSource.getRepository(CustodyHistory);
const DocumentRepository = AppDataSource.getRepository(Document);

async function getCustodyHistoryForDocument(req: Request, res: Response) {
  const { id: document_id } = req.params;

  const document = await DocumentRepository.findOneBy({ document_id });

  if (!document) {
    res.status(404).json({
      message: "Document with id provided not found",
      custodyHistory: null,
    });
    return;
  }

  const custodyHistory = await CustodyHistoryRepository.findBy({
    document_id: document_id,
  });
  res.status(200).json({
    message: "Document history retrieved",
    custodyHistory,
  });
}

export { getCustodyHistoryForDocument };
