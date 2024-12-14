import { DataSource } from "typeorm";
import { Config } from "./config";

const {
  database_host,
  database_name,
  database_password,
  database_port,
  database_user,
} = Config;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: database_host,
  port: database_port,
  username: database_user,
  password: database_password,
  database: database_name,
  synchronize: true,
  logging: ["query", "error"],
  entities: [__dirname + "/entities/*.{js,ts}"],
});
