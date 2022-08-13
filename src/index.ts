import app from "./app";
import Logger from "./logger";
import knex from "./db";
const PORT = process.env.PORT || 3000;

// start the express app
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT must be defined");
  }
  try {
    await knex.raw("SELECT 1");
    Logger.info("Connected to the database");
    app.listen(PORT, () => {
      Logger.info(`Server started on port ${PORT} 🔥🔥🔥`);
    });
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
};

start();
