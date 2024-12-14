import { IArchiveDocument } from "./document";
import { IUser } from "./user";

export interface IArchive {
  id: number;
  archiveId: string;
  itemNumber: number;
  archivalNumber: string;
  description: string;
  remarks: string;
  coveringDate: string;
  fileNumber: string;
  transactions: IArchiveTransaction[];
}

export interface IArchiveTransaction {
  id: number;
  transactionId: string;
  archive: IArchive;
  archiveId: string;
  requestedById: string;
  requestedBy: IUser;
  requestedAt: Date;
  department: string;
  approved: boolean;
  retrievedBy: string | null;
  dateProduced: Date | null;
  dateReturned: Date | null;
  remarks: string | null;
}

export interface INewArchive {
  itemNumber?: string;
  description?: string;
  remarks?: string;
  coveringDate?: string;
  fileNumber?: string;
}
