import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column({ type: 'varchar', nullable: true })
  guest_email?: string;

  @Column({ type: 'varchar', nullable: true })
  guest_phone?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  cod_status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping_cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar' })
  delivery_address: string;

  @Column({ type: 'varchar' })
  delivery_city: string;

  @Column({ type: 'varchar' })
  delivery_postal_code: string;

  @Column({ type: 'varchar', nullable: true })
  tracking_number?: string;

  @Column({ type: 'varchar', nullable: true })
  ozonexpress_id?: string;

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
