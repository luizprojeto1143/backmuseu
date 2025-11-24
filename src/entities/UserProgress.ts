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
  user_id: number; // 🔥 AGORA É NUMBER

  @Column({ type: "varchar" })
  tenant_id: string;

  @Column({ type: "int", default: 0 })
  viewed_items: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
