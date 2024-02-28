import { Router } from "express";
import { createChallenge, getChallenges } from "./challenges_service";

const router = Router();

router.post("/create", createChallenge);
router.use("/", getChallenges);

export default router;