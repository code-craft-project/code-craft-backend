import { Router } from "express";

const router = Router();
import challengesRouter from "./challenges/index";
import authRouter from "./auth/index";

router.use("/auth", authRouter);
router.use("/challenges", challengesRouter);

export default router;