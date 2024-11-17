import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ArchiveDocument, Document } from "./Document";
import { User } from "./User";

@Entity({ name: "transaction" })
export class Transaction extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "transaction_id" })
  transactionId: string;

  @Column({ type: "uuid", name: "document_id" })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: "document_id" })
  document: Document;

  @Column({ type: "uuid", name: "sender_id" })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column({ type: "uuid", name: "receiver_id" })
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @Column({ type: "text" })
  comment: string;

  @Column({ type: "timestamp", name: "sent_timestamp" })
  sentTimestamp: Date;

  @Column({ type: "boolean", default: false })
  acknowledged: boolean;

  @Column({ type: "timestamp", name: "acknowledged_timestamp", nullable: true })
  acknowledgedTimestamp: Date | null;
}

@Entity({ name: "archive_transaction" })
export class ArchiveTransaction extends BaseEntity {
  @PrimaryColumn({ name: "transaction_id" })
  transactionId: string;

  @Column({ type: "uuid", name: "document_id" })
  documentId: string;

  @ManyToOne(() => ArchiveDocument)
  @JoinColumn({ name: "document_id" })
  document: ArchiveDocument;

  @Column({ type: "uuid", name: "requester_id" })
  requesterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "requester_id" })
  requester: User;

  @Column({ type: "timestamp", name: "requested_at" })
  requestedAt: Date;

  @Column({
    type: "varchar",
    name: "status",
    enum: ["submitted", "rejected", "approved", "accepted"],
    default: "submitted",
  })
  status: string;

  @Column({ type: "text" })
  comment: string;

  @Column({ type: "uuid", name: "request_approver_id" })
  requestApproverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "request_approver_id" })
  requestApprover: User;

  @Column({ type: "timestamp", name: "request_approved_at", nullable: true })
  requestApprovedAt: Date | null;
}
