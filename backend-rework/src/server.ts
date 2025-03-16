import "reflect-metadata";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import http from "http";

import { app } from "./app";
import { AppDataSource } from "./config/database";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

AppDataSource.initialize().then(() => {
  console.log("🚀 Database connection successful");
  httpServer.listen(PORT, () => {
    console.log(`[+] Server listening at http://localhost:${PORT}`);
  });
});
