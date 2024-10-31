import "reflect-metadata";
import http from "http";
import { config as dotenvConfig } from "dotenv";

import { createServer } from "./server";
import { Config } from "./config";
import { AppDataSource } from "./data-source";

async function initializeServer() {
  dotenvConfig();
  const { port } = Config;

  const app = createServer();
  const httpServer = http.createServer(app);

    AppDataSource.initialize()
      .then(async () => {
        console.log("Database connection successful");
        await new Promise<void>((resolve) => {
          httpServer.listen({ port }, resolve);
        });
        console.log(`Server is running at http://localhost:${port}`);
      })
      .catch((err) => {
        console.log("Database connection failed");
        console.log(`${err}`);
      });
  // await new Promise<void>((resolve) => {
  //   httpServer.listen({ port }, resolve);
  // });
  // console.log(`Server is running at http://localhost:${port}`);
}
initializeServer();
