import { Router } from "express";
import { jobPostsController } from "@/app/controllers";

const router = Router();

router.post("/create", jobPostsController.createJobPost);
router.get("/:id", jobPostsController.getJobPostById);
router.get("/", jobPostsController.getJobPosts);

export default router;