import {Entity, Column, PrimaryColumn, BaseEntity} from 'typeorm'

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn({type: "uuid"})
    user_id: string

    @Column({type: "varchar2", length: 64})
    name: string

    @Column({type:"varchar2", length: 128})
    email: string

    @Column({type: "varchar2", enum: ["user"], length: 50})
    role: string
}