import {PrimaryColumn, Column, Entity, BaseEntity, OneToOne, JoinColumn} from 'typeorm'
import { User } from './User'

@Entity()
export class Document extends BaseEntity {
    @PrimaryColumn({type: "uuid"})
    document_id: string

    @Column({type: "varchar", length: 64, nullable: false})
    title: string

    @Column({type: "varchar", length: 255, nullable: false})
    description: string

    @Column({type: "varchar", unique: true, nullable: false})
    serialNumber: string

    @Column({type: "varchar", enum: ["available", "assigned"], length: 50, default: "available"})
    status: string

    @OneToOne(() => User)
    @JoinColumn()
    current_holder: User
}