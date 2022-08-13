require("dotenv").config();

import "express-async-errors";

// initialize the express app
import express, { Application, NextFunction, Request, Response } from "express";
const app: Application = express();

// security middleware
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";
const xssClean = require("xss-clean");
import cookieSession from "cookie-session";

// application middleware
import { applicationRoutes } from "./routes";
import { errorHandlerMiddleware, notFound } from "./middleware";
import { StatusCodes } from "http-status-codes";
import Logger from "./logger";

// use security middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(xssClean());

// endpoint url logs
app.use(function (req: Request, _: Response, next: NextFunction) {
  const requestMethod = req.method;
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  Logger.info(`[ ${requestMethod} ] ${fullUrl}`);
  next();
});

app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    handler: (_, res) => {
      return res
        .status(StatusCodes.TOO_MANY_REQUESTS)
        .json({ errors: [{ message: "Too many requests!" }] });
    },
  })
);

// cookie session middleware
app.use(
  cookieSession({
    signed: false,
    secure: false,
    name: "lendsqr-session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY!],
    sameSite: "lax",
  })
);

// home route
app.get("/", (_: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Welcome to LendsQR api 🔥🔥🔥" });
});

app.use("/api/v1", applicationRoutes);

// not found middleware
app.use(notFound);

// error handler middleware
app.use(errorHandlerMiddleware);

export default app;
