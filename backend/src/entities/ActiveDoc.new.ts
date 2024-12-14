import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { ActiveDocTransaction } from "./ActiveDocTransaction.new";

@Entity({ name: "new_active_doc" })
export class ActiveDoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "uuid",
    name: "active_doc_id",
    unique: true,
    nullable: false,
  })
  activeDocId: string;

  @Column({ type: "varchar", nullable: false })
  subject: string;

  @Column({ type: "varchar", name: "reference_number", nullable: false })
  referenceNumber: string;

  @Column({ type: "uuid", name: "current_holder_id", nullable: false })
  currentHolderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "current_holder_id", referencedColumnName: "userId" })
  currentHolder: User;

  @Column({ type: "uuid", name: "originator_id", nullable: false })
  originatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "originator_id", referencedColumnName: "userId" })
  originator: User;

  @ManyToMany(() => User, (user) => user.documentsHeld)
  @JoinTable({
    joinColumn: {
      name: "active_doc_id",
      referencedColumnName: "activeDocId",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "userId",
    },
  })
  previousHolders: User[];

  @OneToMany(() => ActiveDocTransaction, (transaction) => transaction.activeDoc)
  transactions: ActiveDocTransaction[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
