import knex from "knex";
import Logger from "../logger";
const knexfile = require("../../knexfile");

const mysql = knex(knexfile);

mysql
  .raw("SELECT 1")
  .then(() => {
    Logger.info("Database connected");
  })
  .catch((e) => {
    Logger.info("Database not connected");
    Logger.error(e);
  });

export default mysql;
