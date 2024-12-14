export interface INotification {
  id: number;
  notificationId: string;
  transactionId: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
}

export interface IAcknowledgement {
  transactionId: string;
  notificationId: string;
}

export type NotificationState =
  | { isOpen: false; notification: null }
  | { isOpen: true; notification: INotification };

export enum NotificationEvent {
  ForwardActiveDoc = "forward_active_doc",
  AcknowledgeActiveDoc = "acknowledge_active_doc",
  ReturnActiveDoc = "return_active_doc",
  ArchiveRequest = "archive_request",
  ArchiveRequestApproval = "archive_request_approval",
  ArchiveRequestFulfillMent = "archive_request_fulfillment",
}
