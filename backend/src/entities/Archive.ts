import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "archive" })
export class Archive extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "uuid", name: "archive_id", unique: true })
  archiveId: string;

  @Column({
    type: "varchar",
    name: "item_number",
    nullable: false,
    unique: true,
  })
  itemNumber: string;

  @Column({
    type: "int",
    name: "archival_number",
    nullable: false,
    unique: true,
  })
  @Generated("increment")
  archivalNumber: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  remarks: string;

  @Column({ type: "varchar", length: 32, name: "covering_date" })
  coveringDate: string;

  @Column({ type: "varchar", name: "file_number" })
  fileNumber: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
