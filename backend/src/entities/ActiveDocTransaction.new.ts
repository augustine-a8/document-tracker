import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ActiveDoc } from "./ActiveDoc.new";
import { User } from "./User";
import { ActiveDocTransactionStateHistory } from "./ActiveDocTransactionStateHistory";

@Entity({ name: "new_active_doc_transaction" })
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

  @OneToMany(
    () => ActiveDocTransactionStateHistory,
    (stateHistory) => stateHistory.transaction
  )
  stateHistories: ActiveDocTransactionStateHistory[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
