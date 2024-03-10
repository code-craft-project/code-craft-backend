import { Router } from "express";
import { challengesController } from "@/app/controllers";

const router = Router();

router.post("/create", challengesController.createChallenge);
router.get("/:id", challengesController.getChallengeById);
router.get("/", challengesController.getChallenges);

export default router;