import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Logger from "../logger";

export const notFound: RequestHandler = (req, res) => {
  Logger.error("Route does not exist");
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: "Route does not exist" });
};
