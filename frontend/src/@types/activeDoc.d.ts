import { IUser } from "./user";

export enum ActiveDocTransactionState {
  SENT = "SENT",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  RETURNED = "RETURNED",
}

export interface IActiveDoc {
  id: number;
  activeDocId: string;
  subject: string;
  referenceNumber: string;
  currentHolderId: string;
  currentHolder: IUser;
  originatorId: string;
  originator: IUser;
  createdAt: string;
}

export interface IActiveDocTransaction {
  id: number;
  transactionId: string;
  activDocId: string;
  activeDoc: IActiveDoc;
  comments: string;
  sourceId: string;
  source: IUser;
  state: ActiveDocTransactionState;
  forwardedToId: string;
  forwardedTo: IUser;
  forwardedAt: Date;
  acknowledged: boolean;
}

export interface INewActiveDocTransaction {
  id: number;
  transactionId: string;
  activeDocId: string;
  activeDoc: IActiveDoc;
  sourceId: string;
  source: IUser;
  forwardedToId: string;
  forwardedTo: IUser;
  stateHistories: IActiveDocTransactionStateHistory[];
}

export interface IActiveDocTransactionStateHistory {
  id: number;
  stateHistoryId: string;
  transactionId: string;
  comment: string;
  transaction: INewActiveDocTransaction;
  state: ActiveDocTransactionState;
  date: Date;
}

export interface INewActiveDoc {
  subject?: string;
  referenceNumber?: string;
}

export interface IPendingAcknowledgements {
  id: number;
  activeDocId: string;
  subject: string;
  referenceNumber: string;
  currentHolderId: string;
  currentHolder: IUser;
  originatorId: string;
  originator: IUser;
  createdAt: string;
  transactions: INewActiveDocTransaction[];
}
