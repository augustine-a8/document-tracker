import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Document } from "./Document";
import { User } from "./User";

@Entity()
@Unique(["history_id", "document_id"])
@Unique(["history_id", "previous_holder_id"])
@Unique(["history_id", "current_holder_id"])
export class CustodyHistory extends BaseEntity {
  @PrimaryColumn({ type: "uuid" })
  history_id: string;

  @Column({ type: "uuid" })
  document_id: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: "document_id" })
  document: Document;

  @Column({ type: "uuid", nullable: true })
  previous_holder_id: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "previous_holder_id" })
  previous_holder: User;

  @Column({ type: "uuid" })
  current_holder_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "current_holder_id" })
  current_holder: User;

  @Column({ type: "text" })
  comment: string;

  @Column({ type: "timestamp" })
  timestamp: Date;
}
