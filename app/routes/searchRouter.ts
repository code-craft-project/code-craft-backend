import { Router } from "express";
import { searchController } from "@/app/controllers";

const router = Router();

router.get("/job_posts", searchController.searchJobPosts);
router.get("/challenges", searchController.searchChallenges);
router.get("/events", searchController.searchEvents);
router.get("/organizations", searchController.searchOrganizations);

export default router;