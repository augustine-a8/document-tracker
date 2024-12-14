import {
  Entity,
  BaseEntity,
  JoinColumn,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { MailStatus } from "../@types/mail";

@Entity({ name: "driver" })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "driver_id", unique: true, nullable: false })
  driverId: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 10 })
  contact: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

@Entity({ name: "mail" })
export class Mail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "mail_id", unique: true, nullable: false })
  mailId: string;

  @Column({ type: "varchar", name: "reference_number" })
  referenceNumber: string;

  @Column({ type: "timestamp" })
  date: Date;

  @Column({ type: "varchar" })
  addressee: string;

  @Column({
    type: "enum",
    enum: ["pending", "transit", "delivered"],
    default: "pending",
  })
  status: MailStatus;

  @Column({ type: "uuid", name: "driver_id", nullable: true })
  driverId: string | null;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: "driver_id", referencedColumnName: "driverId" })
  driver: Driver;

  @Column({ type: "varchar", length: 155, nullable: true })
  receipient: string;

  @Column({
    type: "varchar",
    length: 10,
    name: "receipient_contact",
    nullable: true,
  })
  receipientContact: string;

  @Column({ type: "timestamp", nullable: true, name: "received_at" })
  receivedAt: Date | null;

  @Column({ type: "text", name: "receipient_signature_url", nullable: true })
  receipientSignatureUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

@Entity({ name: "mail_log" })
export class MailLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", name: "mail_log_id", unique: true, nullable: false })
  mailLogId: string;

  @Column({ type: "uuid", name: "mail_id" })
  mailId: string;

  @ManyToOne(() => Mail)
  @JoinColumn({ name: "mail_id", referencedColumnName: "mailId" })
  mail: Mail;

  @Column({
    type: "enum",
    enum: ["pending", "transit", "delivered"],
    default: "pending",
  })
  status: MailStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
