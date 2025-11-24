import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  title: string;

  @Column({ type: "date" })
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  image_url: string;
}
