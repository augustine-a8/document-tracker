import {
  PrimaryColumn,
  Column,
  Entity,
  BaseEntity,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity({ name: "document" })
export class Document extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "document_id" })
  documentId: string;

  @Column({ type: "varchar", length: 64, nullable: false })
  title: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  description: string;

  @Column({
    type: "varchar",
    name: "serial_number",
    unique: true,
    nullable: false,
  })
  serialNumber: string;

  @Column({
    type: "varchar",
    length: 50,
    default: "available",
  })
  type: string;

  @Column({ type: "uuid", name: "creator_id" })
  creatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "creator_id" })
  creator: User;

  @Column({ type: "uuid", name: "current_holder_id" })
  currentHolderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "current_holder_id" })
  currentHolder: User;

  @OneToMany(() => Transaction, (transaction) => transaction.document)
  transactions: Transaction[];
}
