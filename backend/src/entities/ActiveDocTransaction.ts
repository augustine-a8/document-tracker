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
import { ActiveDoc } from "./ActiveDoc";
import { User } from "./User";
import { ActiveDocTransactionState } from "../@types/activeDocTransaction";

@Entity({ name: "active_doc_transaction" })
export class ActiveDocTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "transaction_id", unique: true })
  transactionId: string;

  @Column({ type: "uuid", name: "active_doc_id" })
  activeDocId: string;

  @ManyToOne(() => ActiveDoc)
  @JoinColumn({ name: "active_doc_id", referencedColumnName: "activeDocId" })
  activeDoc: ActiveDoc;

  @Column({ type: "text" })
  comments: string;

  @Column({ type: "uuid", name: "source_id" })
  sourceId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "source_id", referencedColumnName: "userId" })
  source: User;

  @Column({ type: "uuid", name: "forwarded_to_id" })
  forwardedToId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "forwarded_to_id", referencedColumnName: "userId" })
  forwardedTo: User;

  @Column({ type: "timestamp", name: "forwarded_at" })
  forwardedAt: Date;

  @Column({ type: "boolean", default: false })
  acknowledged: boolean;

  @Column({
    type: "enum",
    enum: ActiveDocTransactionState,
    default: ActiveDocTransactionState.SENT,
  })
  state: ActiveDocTransactionState;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
