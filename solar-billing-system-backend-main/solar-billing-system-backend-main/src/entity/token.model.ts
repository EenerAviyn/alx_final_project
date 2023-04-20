import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as moment from 'moment'
import { TransactionEntity } from './transaction.model'

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  token?: string

  @Column({ nullable: false })
  tokenAmount?: number

  @Column({
    nullable: false,
    default: false
  })
  isUsed?: boolean

  @OneToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transactionID' })
  transaction?: TransactionEntity

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: moment.utc().toDate(),
  })
  createdAt?: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: moment.utc().toDate().toString(),
    nullable: true,
  })
  updatedAt?: Date
}
