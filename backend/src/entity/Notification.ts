import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ArchiveTransaction, Transaction } from "./Transaction";
import { NotificationType } from "../@types/notification";

@Entity({ name: "notification" })
export class Notification extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "notification_id" })
  notificationId: string;

  @Column({ type: "uuid", name: "transaction_id" })
  transactionId: string;

  @Column({
    type: "varchar",
    enum: ["acknowledge", "return"],
    name: "notification_type",
  })
  notificationType: NotificationType;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" })
  transaction: Transaction;
}

@Entity({ name: "archive_notification" })
export class ArchiveNotification extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "notification_id" })
  notificationId: string;

  @Column({ type: "uuid", name: "transaction_id" })
  transactionId: string;

  @Column({
    type: "varchar",
    enum: ["request_approval", "archive_document_request"],
    name: "notification_type",
  })
  notificationType: NotificationType;

  @ManyToOne(() => ArchiveTransaction)
  @JoinColumn({ name: "transaction_id" })
  transaction: ArchiveTransaction;
}
