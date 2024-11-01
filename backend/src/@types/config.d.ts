export interface IConfig {
  database_host: string;
  database_name: string;
  database_password: string;
  database_user: string;
  database_port: number;
  port: number;
  jwtSecret: string;
}
