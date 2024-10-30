import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createRoutes } from "./routes";

function createServer(): express.Express {
  const app = express();

  const whitelist = ["http://example1.com", "http://example2.com"];
  const corsOptionsDelegate = function (req: express.Request, callback: any) {
    let corsOptions;
    if (whitelist.indexOf(req.header("Origin") as string) !== -1) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  };
  app.use(cors(corsOptionsDelegate));

  app.use(helmet());
  app.use(express.json());
  app.use(morgan("combined"));

  app.get("/welcome", (req: express.Request, res: express.Response) => {
    res.status(200).json({
      message: "Welcome to the document tracker api",
    });
  });

  createRoutes(app);

  return app;
}

export { createServer };
