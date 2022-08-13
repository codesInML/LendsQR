import crypto from "crypto";
import knex from "../db";
import { Password } from "../helpers";

export const createUser = async (data: any) => {
  const password = await Password.toHash(data.password);
  const user = knex("user").insert({
    fullName: data.fullName,
    email: data.email,
    password,
  });

  return user;
};

export const findUser = async (email: string) => {
  return;
};
