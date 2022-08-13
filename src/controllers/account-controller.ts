import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { successResponse } from "../helpers";
import {
  createAccountService,
  fundAccountService,
  getAccountService,
  transferFundService,
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
  if (!account) throw new BadRequestError("User does not have an account");

  delete account.passcode;
  return successResponse(res, StatusCodes.OK, account);
};

export const fundAccountController = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const account = await fundAccountService(+amount, req.currentUser?.id!);

  if (!account) throw new BadRequestError("Something went wrong");
  return successResponse(res, StatusCodes.CREATED, {
    message: "Account has been funded",
  });
};

export const transferFundController = async (req: Request, res: Response) => {
  const { passcode, recipientAccount, amount } = req.body;
  const account = await transferFundService({
    passcode: `${passcode}`,
    accountNumber: `${recipientAccount}`,
    amount: +amount,
    userID: req.currentUser?.id!,
  });

  if (!account) throw new BadRequestError("An error occurred, try again later");

  if (typeof account == "string") throw new BadRequestError(account);

  return successResponse(res, StatusCodes.CREATED, account);
};
