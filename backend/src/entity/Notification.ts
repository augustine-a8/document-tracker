import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CustodyHistory } from "./CustodyHistory";
import { User } from "./User";
import { Document } from "./Document";

@Entity({ name: "notification" })
export class Notification extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "notification_id" })
  notificationId: string;

  @Column({ type: "uuid", name: "history_id" })
  historyId: string;

  @ManyToOne(() => CustodyHistory)
  @JoinColumn({ name: "history_id" })
  history: CustodyHistory;

  @Column({ type: "uuid", name: "document_id" })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: "document_id" })
  document: Document;

  @Column({ type: "boolean", name: "acknowledged", default: false })
  acknowledged: boolean;
}
