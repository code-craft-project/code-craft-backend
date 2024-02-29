import { Router } from "express";
import { createChallenge, getChallengeById, getChallenges } from "./challenges_service";

const router = Router();

router.post("/create", createChallenge);
router.get("/:id", getChallengeById);
router.get("/", getChallenges);

export default router;