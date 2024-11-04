import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { Document } from "./Document";
import { User } from "./User";
import { NotificationQueue } from "./NotificationQueue";

@Entity({ name: "custody_history" })
// @Unique(["history_id", "document_id"])
// @Unique(["history_id", "previous_holder_id"])
// @Unique(["history_id", "current_holder_id"])
export class CustodyHistory extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "history_id" })
  historyId: string;

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

  @Column({ type: "timestamp", name: "acknowledged_timestamp", nullable: true })
  acknowledgedTimestamp: Date | null;

  @OneToMany(() => NotificationQueue, (notification) => notification.history)
  notificationQueues: NotificationQueue[];
}
