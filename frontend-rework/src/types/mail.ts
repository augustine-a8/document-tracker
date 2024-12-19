enum MailStatus {
  PENDING = "pending",
  TRANSIT = "transit",
  DELIVERED = "delivered",
  FAILED = "failed",
}

const allMailStatuses = [
  MailStatus.PENDING,
  MailStatus.TRANSIT,
  MailStatus.DELIVERED,
  MailStatus.FAILED,
];

export { MailStatus, allMailStatuses };
