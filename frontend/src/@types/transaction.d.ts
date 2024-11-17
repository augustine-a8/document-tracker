import { IDocument } from "./document";
import { IUser } from "./user";

export interface ITransaction {
  transactionId: string;
  documentId: string;
  document: IDocument;
  senderId: string;
  sender: IUser;
  receiverId: string;
  receiver: IUser;
  comment: string;
  sentTimestamp: Date;
  acknowledged: boolean;
  acknowledgedTimestamp: Date | null;
}

export type ArchiveTransactionStatusType =
  | "submitted"
  | "rejected"
  | "approved"
  | "accepted";

export interface IArchiveTransaction {
  transactionId: string;
  documentId: string;
  document: IArchiveDocument;
  requesterId: string;
  requester: IUser;
  requestedAt: Date;
  status: ArchiveTransactionStatusType;
  requestApproverId: string;
  requestApprover: IUser;
  comment: string;
  requestApprovedAt: Date | null;
}
