import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Trail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", default: "Easy" })
  difficulty: "Easy" | "Medium" | "Hard";

  @Column({ type: "int", nullable: true })
  duration_minutes: number;

  @Column({ nullable: true })
  color: string;

  @Column({ type: "simple-array", nullable: true })
  points_ids: string[];
}
