import { Router } from "express";

const router = Router();
import challengesRouter from "./challenges/index";
import companiesRouter from "./companies/index";
import authRouter from "./auth/index";
import { protectedRoutes } from "./protected_routes";

router.use("/", protectedRoutes);
router.use("/auth", authRouter);
router.use("/challenges", challengesRouter);
router.use("/companies", companiesRouter);

export default router;