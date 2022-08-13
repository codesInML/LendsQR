import knex from "../db";
import { Model, Password } from "../helpers";
import { customAlphabet } from "nanoid";
import Logger from "../logger";

const nanoid = customAlphabet("0123456789", 10);

type AccountData = {
  id: number;
  type: string;
  currency: string;
  passcode?: string;
  userID: string;
  accountNumber: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
};

export const createAccountService = async (data: {
  type: string;
  currency: string;
  passcode: string;
  userID: string;
}): Promise<AccountData | null> => {
  try {
    const passcode = await Password.toHash(data.passcode);
    const [id] = await knex(Model.account).insert({
      ...data,
      accountNumber: nanoid(),
      passcode,
    });

    const user = await knex(Model.account).select("*").where({ id });

    return user[0];
  } catch (error) {
    return null;
  }
};

export const fundAccountService = async (amount: number, userID: string) => {
  try {
    let account: AccountData = (
      await knex(Model.account).select("*").where({ userID })
    )[0];
    if (!account) return null;

    const toAdd = +account.balance + amount;

    return await knex(Model.account)
      .where({ userID })
      .update({ balance: `${toAdd}` });
  } catch (error) {
    Logger.error(error);
    return null;
  }
};

export const getAccountService = async (userID: string) => {
  try {
    const account: AccountData = (
      await knex(Model.account).select("*").where({ userID })
    )[0];
    return account;
  } catch (error) {
    Logger.error(error);
    return null;
  }
};
