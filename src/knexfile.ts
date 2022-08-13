// Update with your config settings.
require("dotenv").config({ path: "../.env" });
import path from "path";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "lendsqr_migrations",
      directory: path.resolve(__dirname, "db", "migrations"),
    },
  },
  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      tableName: "lendsqr_migrations",
      directory: path.resolve(__dirname, "db", "migrations"),
    },
  },
};
