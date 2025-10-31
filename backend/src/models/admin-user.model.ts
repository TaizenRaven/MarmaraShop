import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admin_users' })
export class AdminUser extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password_hash: string;

  @Column({ type: 'varchar', default: 'admin' })
  role: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'simple-array', nullable: true })
  permissions?: string[];

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any>;
}
