import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm'

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn({type: "uuid"})
    user_id: string

    @Column({type: "varchar", length: 64, nullable: false})
    name: string

    @Column({type:"varchar", length: 128, nullable: false})
    email: string

    @Column({type: "varchar", enum: ["user"], length: 50, default: "user"})
    role: string
}