import knex from "../db";
import { Model, Password } from "../helpers";
import { customAlphabet } from "nanoid";
import Logger from "../logger";
import { BadRequestError } from "../errors";

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

export const withdrawFundService = async (
  amount: number,
  passcode: string,
  userID: string
) => {
  try {
    const account: AccountData = (
      await knex(Model.account).select("*").where({ userID })
    )[0];

    // check if the sender has sufficient balance
    if (!account || +account.balance < amount) return "Insufficient balance";

    // check if passcode match
    const passcodeMatch = await Password.comparePassword(
      passcode,
      account.passcode!
    );

    if (!passcodeMatch) return "Invalid passcode";

    const toDeduct = +account.balance - amount;

    return await knex(Model.account)
      .where({ userID })
      .update({ balance: `${toDeduct}` });
  } catch (error) {
    Logger.error(error);
    return null;
  }
};

export const transferFundService = async (data: {
  passcode: string;
  accountNumber: string;
  amount: number;
  userID: string;
}) => {
  try {
    const account: AccountData = (
      await knex(Model.account).select("*").where({ userID: data.userID })
    )[0];

    // check if the sender has sufficient balance
    if (!account || +account.balance < data.amount)
      return "Insufficient balance";
    if (account.accountNumber == data.accountNumber)
      return "Cannot transfer to yourself";

    // check if passcode match
    const passcodeMatch = await Password.comparePassword(
      data.passcode,
      account.passcode!
    );

    if (!passcodeMatch) return "Invalid passcode";

    // get recipient account
    const recipientAccount: AccountData = (
      await knex(Model.account)
        .select("*")
        .where({ accountNumber: data.accountNumber })
    )[0];

    // check if it's the same currency
    if (account.currency !== recipientAccount.currency)
      return "Can only send to an account with the same currency";

    //   using SQL transaction to perform the fund transfer
    await knex
      .transaction(function (t) {
        return knex(Model.account)
          .transacting(t)
          .where({ userID: +data.userID })
          .update({ balance: `${+account.balance - data.amount}` })
          .then(function () {
            return t(Model.account)
              .where({ accountNumber: data.accountNumber })
              .update({
                balance: `${+recipientAccount.balance + data.amount}`,
              });
          })
          .then(function () {
            return t(Model.transaction).insert({
              senderID: `${account.userID}`,
              recipientID: `${recipientAccount.userID}`,
              amount: data.amount,
            });
          })
          .then(t.commit)
          .catch(t.rollback);
      })
      .then(function () {
        Logger.info("Transaction completed");
      })
      .catch(function (e) {
        Logger.error("It failed");
        throw e;
      });
    return { transfer: "Completed" };
  } catch (error) {
    Logger.error(error);
    return null;
  }
};
