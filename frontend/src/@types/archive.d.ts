import { IArchiveDocument } from "./document";
import { IUser } from "./user";

export type ArchiveTransactionStatusType =
  | "submitted"
  | "rejected"
  | "approved"
  | "accepted";

export interface IArchiveTransaction {
  archiveTransactionId: string;
  archiveDocumentId: string;
  archiveDocument: IArchiveDocument;
  requesterId: string;
  requester: IUser;
  requestedAt: Date;
  status: ArchiveTransactionStatusType;
  requestApproverId: string;
  requestApprover: IUser;
  comment: string;
  requestApprovedAt: Date | null;
}
