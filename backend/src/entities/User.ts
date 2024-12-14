import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { ActiveDoc } from "./ActiveDoc.new";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "user_id", unique: true })
  userId: string;

  @Column({ type: "varchar", length: 64, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 128, nullable: false })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "varchar" })
  department: string;

  @Column({
    type: "varchar",
    enum: ["user", "admin", "archiver", "director", "registrar"],
    length: 50,
    default: "user",
  })
  role: string;

  @ManyToMany(() => ActiveDoc, (doc) => doc.previousHolders)
  documentsHeld: ActiveDoc[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
