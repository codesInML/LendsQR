import app from "./app";
import Logger from "./logger";
const PORT = process.env.PORT || 3000;

// start the express app
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT must be defined");
  }
  try {
    app.listen(PORT, () => {
      Logger.info(`Server started on port ${PORT} 🔥🔥🔥`);
    });
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
};

start();
