import { IArchiveDocument, IDocument } from "./document";
import { IArchiveTransaction, ITransaction } from "./transaction";
import { IUser } from "./user";

export type NotificationType =
  | "acknowledge"
  | "return"
  | "request_approval"
  | "archive_document_request";

export interface INotification {
  notificationId: string;
  transactionId: string;
  notificationType: NotificationType;
  transaction: ITransaction | IArchiveTransaction;
}

export interface IAcknowledgement {
  transactionId: string;
  notificationId: string;
}

export type NotificationState =
  | { isOpen: false; notification: null }
  | { isOpen: true; notification: INotification };
