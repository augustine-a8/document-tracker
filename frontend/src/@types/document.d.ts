import { IHistory } from "./history";
import { IUser } from "./user";

export interface IDocument {
  documentId: string;
  title: string;
  serialNumber: string;
  type: string;
  currentHolderId: string | null;
  currentHolder: IUser | null;
  custodyHistories: IHistory[];
  description: string;
}

export interface INewDocument {
  serialNumber: string;
  title: string;
  description: string;
  type: string;
}
