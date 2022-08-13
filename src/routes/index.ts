import { Router } from "express";
import { authenticationRoutes } from "./auth-route";

const router = Router();

router.use("/auth", authenticationRoutes);

export { router as applicationRoutes };
