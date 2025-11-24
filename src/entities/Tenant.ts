import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", default: "museum" })
  type: "museum" | "city";

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  theme_color: string;

  @Column({ type: "json", nullable: true })
  custom_categories: string[];

  @Column({ type: "json", nullable: true })
  persona_config: any;
}
