import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'shipments' })
export class Shipment extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  order_id: string;

  @Column({ type: 'varchar', unique: true })
  tracking_number: string;

  @Column({ type: 'varchar', nullable: true })
  ozonexpress_id?: string;

  @Column({
    type: 'enum',
    enum: [
      'pending',
      'accepted',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'failed',
      'returned',
    ],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  current_location?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  shipping_cost?: number;

  @Column({ type: 'timestamp', nullable: true })
  shipped_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimated_delivery?: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_date?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

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
