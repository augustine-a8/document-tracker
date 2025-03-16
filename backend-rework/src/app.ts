import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

app.get("/api/v1/welcome", (req, res) => {
  res.status(200).json({
    message: "Welcome to Document Tracker Backend Api V1",
  });
});

export { app };
