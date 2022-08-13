import { Router } from "express";
import { createAccountController, fundAccountController } from "../controllers";
import { validateRequestMiddleware } from "../helpers";
import { currentUserMiddleware, requireAuthMiddleware } from "../middleware";
import { createAccountSchema, fundAccountSchema } from "../schema";

const router = Router();

router.use(currentUserMiddleware, requireAuthMiddleware);

router
  .route("/")
  .post(
    createAccountSchema(),
    validateRequestMiddleware,
    createAccountController
  )
  .get();

router
  .route("/fund")
  .post(fundAccountSchema(), validateRequestMiddleware, fundAccountController);

export { router as accountRoute };
