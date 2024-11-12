import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Transaction } from "./Transaction";
import { Document } from "./Document";

@Entity({ name: "notification" })
export class Notification extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "notification_id" })
  notificationId: string;

  @Column({ type: "uuid", name: "transaction_id" })
  transactionId: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" })
  transaction: Transaction;

  @Column({ type: "uuid", name: "document_id" })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: "document_id" })
  document: Document;

  @Column({ type: "boolean", name: "acknowledged", default: false })
  acknowledged: boolean;
}
