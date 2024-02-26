import { Router } from "express";

const router = Router();
import challengesRouter from "./challenges/index";

router.use("/challenges", challengesRouter);

export default router;