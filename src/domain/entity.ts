import { Column, PrimaryColumn, Entity } from 'typeorm';

@Entity('extension_users_data_delete_stats')
export class Stats {
  @PrimaryColumn('varchar', { name: 'id', unique: true, length: 13 })
  id: number;

  @Column('varchar', { name: 'delete_date', length: 10 })
  delete_date: string;

  @Column('varchar', { name: 'request_date', length: 10 })
  request_date: string;

  @Column('varchar', { name: 'request_ts', length: 13 })
  request_ts: string;

  @Column('varchar', { name: 'status', length: 256 })
  status: string;

  getKey(): number {
    return this.id;
  }
}