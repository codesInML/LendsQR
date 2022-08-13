import crypto from "crypto";
import knex from "../db";
import { Password } from "../helpers";

export const createUser = async (data: any) => {
  const password = await Password.toHash(data.password);
  const [id] = await knex("user").insert({
    fullName: data.fullName,
    email: data.email,
    password,
  });

  return { id, fullName: data.fullName, email: data.email };
};

export const findUser = async (email: string) => {
  const user = await knex("user").select("*").where({ email });
  return user;
};
