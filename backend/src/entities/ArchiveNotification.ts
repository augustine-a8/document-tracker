import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ArchiveTransaction } from "./ArchiveTransaction";
import { User } from "./User";

@Entity({ name: "archive_notification" })
export class ArchiveNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "notification_id", unique: true })
  notificationId: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "uuid", name: "sender_id" })
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender_id", referencedColumnName: "userId" })
  sender: User;

  @Column({ type: "uuid", name: "receiver_id" })
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "receiver_id", referencedColumnName: "userId" })
  receiver: User;

  @Column({ type: "uuid", name: "transaction_id" })
  transactionId: string;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @ManyToOne(() => ArchiveTransaction)
  @JoinColumn({
    name: "transaction_id",
    referencedColumnName: "transactionId",
  })
  transaction: ArchiveTransaction;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
