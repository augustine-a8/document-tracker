import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { createRoutes } from "./routes";
import { errorHandler } from "./middleware/error-handling";

function createServer(): express.Express {
  const app = express();

  const whitelist = ["http://localhost:5173", "http://example2.com"];
  const corsOptionsDelegate = function (req: express.Request, callback: any) {
    let corsOptions;
    if (whitelist.indexOf(req.header("Origin") as string) !== -1) {
      corsOptions = { origin: true, credentials: true };
    } else {
      corsOptions = { origin: false, credentials: true };
    }
    callback(null, corsOptions);
  };
  app.use(cors(corsOptionsDelegate));

  app.use(helmet());
  app.use(express.json());
  app.use(morgan("combined"));
  app.use(cookieParser());

  app.use(errorHandler);

  app.get("/welcome", (req: express.Request, res: express.Response) => {
    res.status(200).json({
      message: "Welcome to the document tracker api",
    });
  });

  createRoutes(app);

  return app;
}

export { createServer };
