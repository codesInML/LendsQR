import { Router } from "express";
import { accountRoute } from "./account-route";
import { authenticationRoutes } from "./auth-route";

const router = Router();

router.use("/auth", authenticationRoutes);
router.use("/account", accountRoute);

export { router as applicationRoutes };
