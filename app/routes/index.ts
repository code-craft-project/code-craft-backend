import { Router } from "express";

import challengesRouter from "./challenges/index";
import companiesRouter from "./companies/index";
import clubsRouter from "./clubs/index";
import authRouter from "./auth/index";
import jobPostsRouter from "./jobposts/index";
import eventsRouter from "./events/index";

import { protectedRoutes } from "./protected_routes";

const router = Router();

router.use("/", protectedRoutes);
router.use("/auth", authRouter);
router.use("/challenges", challengesRouter);
router.use("/companies", companiesRouter);
router.use("/clubs", clubsRouter);
router.use("/jobposts", jobPostsRouter);
router.use("/events", eventsRouter);

export default router;