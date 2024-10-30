import {PrimaryColumn, Column, Entity, BaseEntity, OneToOne, JoinColumn} from 'typeorm'
import { User } from './User'

@Entity()
export class Document extends BaseEntity {
    @PrimaryColumn({type: "uuid"})
    document_id: string

    @Column({type: "varchar2", length: 64})
    title: string

    @Column({type: "varchar2", length: 255})
    description: string

    @Column({type: "varchar2", enum: ["available", "assigned"], length: 50, default: "available"})
    status: string

    @OneToOne(() => User)
    @JoinColumn()
    current_holder: User
}