import { IDocument } from "./document";
import { IHistory } from "./history";
import { IUser } from "./user";

export interface INotification {
  notificationId: string;
  historyId: string;
  history: IHistory;
  documentId: string;
  document: IDocument;
  acknowledged: boolean;
  senderId: string;
  sender: IUser;
  receiverId: string;
  receiver: IUser;
}

export interface IAcknowledgement {
  historyId: string;
  notificationId: string;
}

export type NotificationType = "acknowledge" | "return";

export interface INotificationQueue {
  type: NotificationType;
  notification: INotification;
}
