import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  user_id: number;

  @Column({ type: "varchar" })
  tenant_id: string;

  @Column({ type: "int", default: 0 })
  viewed_items: number;

  // 🔥 CAMPO QUE FALTAVA (corrige analytics.ts)
  @Column({ type: "simple-array", default: "" })
  visited_points: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
