import { IDocument } from "./document";
import { IUser } from "./user";

export interface IHistory {
  historyId: string;
  documentId: string;
  document: IDocument;
  senderId: string;
  sender: IUser;
  receiverId: string;
  receiver: IUser;
  comment: string;
  sentTimestamp: Date;
  acknowledgedTimestamp: Date | null;
}
