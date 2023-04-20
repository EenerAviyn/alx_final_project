import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as moment from 'moment'
import { TokenEntity } from './token.model'

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  temperature?: number

  @Column({ nullable: false })
  current?: number

  @Column({ nullable: false })
  lightIntensity?: string

  @ManyToOne(() => TokenEntity)
  @JoinColumn({ name: 'tokenID' })
  token?: TokenEntity

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
