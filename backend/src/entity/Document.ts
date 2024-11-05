import {
  PrimaryColumn,
  Column,
  Entity,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { CustodyHistory } from "./CustodyHistory";

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

  @Column({ type: "uuid", name: "current_holder_id" })
  currentHolderId: string;

  @ManyToOne(() => User, (user) => user.currentlyHolding)
  @JoinColumn({ name: "current_holder_id" })
  currentHolder: User;

  @OneToMany(() => CustodyHistory, (custodyHistory) => custodyHistory.document)
  custodyHistories: CustodyHistory[];
}
