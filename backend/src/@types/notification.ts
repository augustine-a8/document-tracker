export type NotificationType =
  | "acknowledge"
  | "return"
  | "request_approval"
  | "request_fulfillment"
  | "archive_document_request";

export enum NotificationEvent {
  ForwardActiveDoc = "forward_active_doc",
  AcknowledgeActiveDoc = "acknowledge_active_doc",
  ReturnActiveDoc = "return_active_doc",
  ArchiveRequest = "archive_request",
  ArchiveRequestApproval = "archive_request_approval",
  ArchiveRequestFulfillMent = "archive_request_fulfillment",
}
