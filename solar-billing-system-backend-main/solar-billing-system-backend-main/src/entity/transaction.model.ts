import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as moment from 'moment'
import { TransactionStatus } from './transaction.repository'

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column ({ nullable: false })
  requestID?: string

  @Column({ nullable: false })
  amount?: number

  @Column({ nullable: false })
  phoneNumber?: string

  @Column({ nullable: true })
  transactionCode?: string

  @Column({
    nullable: true,
    type: 'jsonb'
  })
  mpesaResponse?: {[key: string]: any}

  @Column({ nullable: false })
  status?: TransactionStatus

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
