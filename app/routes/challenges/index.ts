import { Router } from "express";
import { challengesController } from "@/app/controllers";

const router = Router();

router.get("/topic/:topic", challengesController.getChallengesByTopic);
router.post("/create", challengesController.createChallenge);
router.post("/:id/update", challengesController.updateChallenge);
router.get("/:id", challengesController.getChallengeById);
router.get("/:id/comments", challengesController.getChallengeComments);
router.post("/:id/comments/create", challengesController.createComment);
router.get("/:id/comments/:comment_id", challengesController.getCommentById);
router.post("/:id/comments/:comment_id/toggle_like", challengesController.toggleLikeAComment);
router.post("/:id/comments/:comment_id/reply", challengesController.replyToComment);
router.get("/:id/test_cases", challengesController.getTestCases);
router.post("/:id/test_cases/create", challengesController.createTestCases);
router.get("/:id/submissions", challengesController.getSubmissions);
router.get("/", challengesController.getChallenges);

export default router;