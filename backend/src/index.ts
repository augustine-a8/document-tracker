import "reflect-metadata";
import http from "http";
import { config as dotenvConfig } from "dotenv";
import { Server } from "socket.io";

import { createServer } from "./server";
import { Config } from "./config";
import { AppDataSource } from "./data-source";
import { SocketService } from "./services/SocketService";

async function initializeServer() {
  dotenvConfig();
  const { port, jwtSecret } = Config;

  const app = createServer();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  AppDataSource.initialize()
    .then(async () => {
      console.log("Database connection successful");
      SocketService.getInstance(io);
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
