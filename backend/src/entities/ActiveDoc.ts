import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  OneToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "active_doc" })
export class ActiveDoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "active_doc_id", unique: true })
  activeDocId: string;

  @Column({ type: "varchar" })
  subject: string;

  @Column({ type: "varchar", name: "reference_number" })
  referenceNumber: string;

  @Column({ type: "uuid", name: "current_holder_id" })
  currentHolderId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "current_holder_id", referencedColumnName: "userId" })
  currentHolder: User;

  @Column({ type: "uuid", name: "originator_id" })
  originatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "originator_id", referencedColumnName: "userId" })
  originator: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
