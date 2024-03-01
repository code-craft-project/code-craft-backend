import { Router } from "express";
import { createJobPost, getJobPostById, getJobPosts } from "./jobposts_service";

const router = Router();

router.post("/create", createJobPost);
router.get("/:id", getJobPostById);
router.get("/", getJobPosts);

export default router;