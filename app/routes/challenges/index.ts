import { Router } from "express";
import { getChallenges } from "./getChallenges";

const router = Router();

router.use("/", getChallenges);

export default router;