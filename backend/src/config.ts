const Config = {
  database_host: process.env.DATABASE_HOST,
  database_name: process.env.DATABASE_NAME,
  database_password: process.env.DATABASE_PASSWORD,
  database_user: process.env.DATABASE_USERNAME,
  database_port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
  port: parseInt(process.env.PORT as string, 10) || 8888,
};

export { Config };
