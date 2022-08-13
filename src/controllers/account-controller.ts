import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { successResponse } from "../helpers";
import Logger from "../logger";
import {
  createAccountService,
  fundAccountService,
  getAccountService,
} from "../services";

export const createAccountController = async (req: Request, res: Response) => {
  const { currency, accountType, passcode } = req.body;
  const account = await createAccountService({
    currency,
    type: accountType,
    passcode: `${passcode}`,
    userID: req.currentUser?.id!,
  });

  if (!account) throw new BadRequestError("User already has an account");

  delete account.passcode;
  return successResponse(res, StatusCodes.CREATED, account);
};

export const getAccountController = async (req: Request, res: Response) => {
  const account = await getAccountService(req.currentUser?.id!);
  return successResponse(res, StatusCodes.OK, account);
};

export const fundAccountController = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const account = await fundAccountService(+amount, req.currentUser?.id!);

  Logger.info({ account });
  if (!account) throw new BadRequestError("Something went wrong");
  return successResponse(res, StatusCodes.CREATED, {
    message: "Account has been funded",
  });
};
