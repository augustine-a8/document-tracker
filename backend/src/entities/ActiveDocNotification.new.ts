import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ActiveDocTransaction } from "./ActiveDocTransaction.new";
import { User } from "./User";
import { ActiveDocTransactionStateHistory } from "./ActiveDocTransactionStateHistory";

@Entity({ name: "new_active_doc_notification" })
export class ActiveDocNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "notification_id", unique: true })
  notificationId: string;

  @Column({ type: "uuid", name: "transaction_state_history_id" })
  transactionStateHistoryId: string;

  @ManyToOne(() => ActiveDocTransactionStateHistory)
  @JoinColumn({
    name: "transaction_state_history_id",
    referencedColumnName: "stateHistoryId",
  })
  transactionStateHistory: ActiveDocTransactionStateHistory;

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

  @Column({ type: "text" })
  message: string;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
