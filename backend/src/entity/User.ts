import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({ type: "varchar", length: 64, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 128, nullable: false })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({
    type: "varchar",
    enum: ["user", "admin", "archiver", "HOD"],
    length: 50,
    default: "user",
  })
  role: string;
}
