import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Archive } from "./Archive";
import { User } from "./User";

@Entity({ name: "archive_transaction" })
export class ArchiveTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: "uuid",
    nullable: false,
    unique: true,
    name: "transaction_id",
  })
  transactionId: string;

  @Column({ type: "uuid", name: "archive_id" })
  archiveId: string;

  @ManyToOne(() => Archive)
  @JoinColumn({ name: "archive_id", referencedColumnName: "archiveId" })
  archive: Archive;

  @Column({ type: "uuid", name: "requested_by_id" })
  requestedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "requested_by_id", referencedColumnName: "userId" })
  requestedBy: User;

  @Column({ type: "timestamp", name: "requested_at" })
  requestedAt: Date;

  @Column({ type: "varchar", length: 128 })
  department: string;

  @Column({ type: "bool", name: "approved", default: false })
  approved: boolean;

  @Column({ type: "varchar", length: 62, name: "retrieved_by", nullable: true })
  retrievedBy: string | null;

  @Column({ type: "timestamp", name: "date_produced", nullable: true })
  dateProduced: Date | null;

  @Column({ type: "boolean", default: false })
  produced: boolean;

  @Column({ type: "timestamp", name: "date_returned", nullable: true })
  dateReturned: Date | null;

  @Column({ type: "text", nullable: true })
  remarks: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  //TODO: signature/intials for dateProduced and dateReturned
}
