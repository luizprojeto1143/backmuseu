import "reflect-metadata";
import { DataSource } from "typeorm";
import { Tenant } from "../entities/Tenant";
import { User } from "../entities/User";
import { Point } from "../entities/Point";
import { Trail } from "../entities/Trail";
import { Event } from "../entities/Event";
import { Review } from "../entities/Review";
import { UserProgress } from "../entities/UserProgress";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "cultura_viva",
  synchronize: true,
  logging: false,
  entities: [Tenant, User, Point, Trail, Event, Review, UserProgress],
  migrations: [],
});
