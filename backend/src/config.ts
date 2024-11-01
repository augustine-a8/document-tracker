import { IConfig } from "./@types/config";

const Config: IConfig = {
  database_host: process.env.DATABASE_HOST as string,
  database_name: process.env.DATABASE_NAME as string,
  database_password: process.env.DATABASE_PASSWORD as string,
  database_user: process.env.DATABASE_USERNAME as string,
  database_port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
  port: parseInt(process.env.PORT as string, 10) || 8888,
  jwtSecret: process.env.JWT_SECRET as string,
};

export { Config };
