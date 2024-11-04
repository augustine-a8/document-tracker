import { DataSource } from "typeorm";

import { User, Document, CustodyHistory } from "./entity";
import { Config } from "./config";
import { NotificationQueue } from "./entity/NotificationQueue";

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
  logging: true,
  entities: [User, Document, CustodyHistory, NotificationQueue],
  subscribers: [],
  migrations: [],
});
