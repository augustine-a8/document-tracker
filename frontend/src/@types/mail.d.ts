type MailStatus = "pending" | "transit" | "delivered" | "failed";

export interface IDriver {
  driverId: string;
  name: string;
  contact: string;
}

export interface IMail {
  mailId: string;
  referenceNumber: string;
  date: Date;
  addressee: string;
  status: MailStatus;
  driverId: string;
  driver: IDriver | null;
  receipient: string;
  receipientContact: string;
  receivedAt: Date | null;
  receipientSignatureUrl: string;
}

export interface IMaliLog {
  mailLogId: string;
  mailId: string;
  mail: Mail;
  status: MailStatus;
  updatedAt: Date;
}
