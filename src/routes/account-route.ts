import { Router } from "express";
import {
  createAccountController,
  fundAccountController,
  getAccountController,
  transferFundController,
} from "../controllers";
import { validateRequestMiddleware } from "../helpers";
import { currentUserMiddleware, requireAuthMiddleware } from "../middleware";
import {
  createAccountSchema,
  fundAccountSchema,
  transferFundSchema,
} from "../schema";

const router = Router();

router.use(currentUserMiddleware, requireAuthMiddleware);

router
  .route("/")
  .post(
    createAccountSchema(),
    validateRequestMiddleware,
    createAccountController
  )
  .get(getAccountController);

router
  .route("/fund")
  .post(fundAccountSchema(), validateRequestMiddleware, fundAccountController);

router
  .route("/transfer")
  .post(
    transferFundSchema(),
    validateRequestMiddleware,
    transferFundController
  );

export { router as accountRoute };
