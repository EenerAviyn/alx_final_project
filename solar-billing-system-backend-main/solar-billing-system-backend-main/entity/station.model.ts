import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as moment from 'moment'

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  name?: string

  @Column({ nullable: false })
  city?: string

  @Column({
    nullable: false,
    type: 'jsonb',
  })
  coordinates?: {
    latitude: number
    longitude: number
  }

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
