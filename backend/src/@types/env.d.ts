declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_TYPE: "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-mysql",
        DATABASE_HOST: string,
        DATABASE_PORT: number,
        DATABASE_USERNAME: string,
        DATABASE_PASSWORD: string,
        DATABASE_NAME: string,
    }
  }
  