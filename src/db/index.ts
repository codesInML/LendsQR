import knex from "knex";
import Logger from "../logger";
const knexfile = require("../knexfile");

export default knex(knexfile);
