import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Point {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  number_code: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: "json", nullable: true })
  media_urls: any;

  @Column({ type: "json", nullable: true })
  location: { latitude: number; longitude: number };

  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  @Column({ type: "json", nullable: true })
  gamification: any;
}
