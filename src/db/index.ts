import knex, { Knex } from "knex";
const knexfile = require("../knexfile");

let db: Knex;
if (process.env.NODE_ENV === "test") {
  db = knex(knexfile.test);
} else {
  db = knex(knexfile.development);
}

export default db;
