import { Router } from "express";

import challengesRouter from "./challenges/index";
import organizationsRouter from "./organizations/index";
import authRouter from "./authRouter";
import jobPostsRouter from "./jobposts/index";
import eventsRouter from "./events/index";
import userRouter from "./user/index";
import uploadRouter from "./uploadRouter";

import { authController } from "../controllers";

const router = Router();

router.use("/", authController.routeProtectionMiddleWare);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/challenges", challengesRouter);
router.use("/organizations", organizationsRouter);
router.use("/jobposts", jobPostsRouter);
router.use("/events", eventsRouter);
router.use("/upload", uploadRouter);

export default router;