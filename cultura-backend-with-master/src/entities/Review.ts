import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  point_id: string;

  @Column()
  user_id: string;

  @Column({ type: "int" })
  rating: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @Column({ type: "text", nullable: true })
  reply: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
