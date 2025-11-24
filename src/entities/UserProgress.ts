import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class UserProgress {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  tenant_id: string;

  @Column({ type: "int", default: 0 })
  xp: number;

  @Column({ type: "int", default: 1 })
  level: number;

  @Column({ type: "simple-array", nullable: true })
  visited_points: string[];

  @Column({ type: "simple-array", nullable: true })
  solved_riddles: string[];

  @Column({ type: "simple-array", nullable: true })
  unlocked_achievements: string[];

  @Column({ type: "text", nullable: true })
  souvenir_text: string;
}
