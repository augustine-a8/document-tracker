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
import { ActiveDocTransactionState } from "../@types/activeDocTransaction";

@Entity({ name: "active_doc_transaction_state_history" })
export class ActiveDocTransactionStateHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "uuid",
    name: "state_history_id",
    nullable: false,
    unique: true,
  })
  stateHistoryId: string;

  @Column({ type: "text" })
  comment: string;

  @Column({ type: "uuid", name: "transaction_id" })
  transactionId: string;

  @ManyToOne(() => ActiveDocTransaction)
  @JoinColumn({ name: "transaction_id", referencedColumnName: "transactionId" })
  transaction: ActiveDocTransaction;

  @Column({
    type: "enum",
    enum: ActiveDocTransactionState,
    default: ActiveDocTransactionState.SENT,
  })
  state: ActiveDocTransactionState;

  @Column({ type: "timestamp" })
  date: Date;
}
