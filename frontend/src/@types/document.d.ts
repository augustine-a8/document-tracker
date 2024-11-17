import { ITransaction } from "./transaction";
import { IUser } from "./user";

export interface IDocument {
  documentId: string;
  title: string;
  serialNumber: string;
  type: string;
  currentHolderId: string | null;
  currentHolder: IUser | null;
  transactions: ITransaction[];
  description: string;
  creatorId: string;
  creator: IUser;
}

export interface INewDocument {
  serialNumber: string;
  title: string;
  description: string;
  type: string;
}

export interface IArchiveDocument {
  documentId: string;
  title: string;
  serialNumber: string;
  type: string;
  currentHolderId: string | null;
  currentHolder: IUser | null;
  location: string;
}
