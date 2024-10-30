import {Entity, BaseEntity, Column, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm'
import { Document } from './Document'
import { User } from './User'

@Entity()
export class CustodyHistory extends BaseEntity {
    @PrimaryColumn({type: "uuid"})
    history_id: string
    
    @OneToOne(() => Document)
    @JoinColumn()
    document_id: Document

    @OneToOne(() => User)
    @JoinColumn()
    previous_holder_id: User

    @OneToOne(() => User)
    @JoinColumn()
    current_holder_id: User

    @Column({type: "text"})
    comment: string

    @Column({type: "timestamp"})
    timestamp: Date
}