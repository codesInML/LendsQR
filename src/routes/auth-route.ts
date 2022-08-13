import { Router } from "express";
import {
  loginController,
  signOutController,
  registerController,
  currentUser,
} from "../controllers";
import { validateRequestMiddleware } from "../helpers";
import { currentUserMiddleware } from "../middleware";
import { registerSchema, loginSchema } from "../schema";

const router = Router();

// Registration routes
router
  .route("/register")
  .post(registerSchema(), validateRequestMiddleware, registerController);

// sign in route
router
  .route("/signin")
  .post(loginSchema(), validateRequestMiddleware, loginController);

// sign out route
router.route("/signout").get(signOutController);

// current user route
router.route("/current-user").get(currentUserMiddleware, currentUser);

export { router as authenticationRoutes };
