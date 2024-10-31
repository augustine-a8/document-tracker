import {
  PrimaryColumn,
  Column,
  Entity,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { CustodyHistory } from "./CustodyHistory";

@Entity()
export class Document extends BaseEntity {
  @PrimaryColumn({ type: "uuid" })
  document_id: string;

  @Column({ type: "varchar", length: 64, nullable: false })
  title: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  description: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  serial_number: string;

  @Column({
    type: "varchar",
    enum: ["available", "assigned"],
    length: 50,
    default: "available",
  })
  status: string;

  @Column({ type: "uuid", nullable: true })
  current_holder_id: string | null;

  @OneToOne(() => User)
  @JoinColumn({ name: "current_holder_id" })
  current_holder: User;

  @OneToMany(() => CustodyHistory, (custodyHistory) => custodyHistory.document)
  custodyHistories: CustodyHistory[];
}
