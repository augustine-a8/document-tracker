import { ArchiveNotification, Notification } from "../entity";

export type NotificationType =
  | "acknowledge"
  | "return"
  | "request_approval"
  | "archive_document_request";

export interface INotification {
  type: NotificationType;
  notification: Notification | ArchiveNotification;
}
