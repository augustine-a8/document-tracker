import { Socket, Server } from "socket.io";
import jwt from "jsonwebtoken";

import { Config } from "../config";

class SocketService {
  private static instance: SocketService;
  public io: Server;
  private activeUsers: { [key: string]: string };

  private constructor(io: Server) {
    this.io = io;
    this.activeUsers = {};
    this.initializeMiddleware();
    this.setupEventListeners();
  }

  private initializeMiddleware() {
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication Error: Token is missing"));
      }

      jwt.verify(token, Config.jwtSecret as string, (err: any, user: any) => {
        if (err) {
          return next(new Error("Authentication Error: Token is invalid"));
        }
        socket.data.userId = user.userId;
        next();
      });
    });
  }

  private setupEventListeners() {
    this.io.on("connection", (socket) => {
      const userId = socket.data.userId;

      if (userId) {
        this.activeUsers[userId] = socket.id;
      }

      socket.on("disconnect", () => {
        if (userId && this.activeUsers[userId] === socket.id) {
          delete this.activeUsers[userId];
        }
      });
    });
  }

  public static getInstance(io?: Server): SocketService {
    if (!SocketService.instance) {
      if (!io) {
        throw new Error("Socket.io instance is not provided");
      }
      SocketService.instance = new SocketService(io);
    }
    return SocketService.instance;
  }

  public isUserOnline(userId: string) {
    return userId in this.activeUsers;
  }

  public emitToUser(userId: string, event: string, data: any) {
    const socketId = this.activeUsers[userId];
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

export { SocketService };
