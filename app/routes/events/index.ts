import { Router } from "express";
import { eventsController } from "@/app/controllers";

const router = Router();

router.post("/:id/join_event", eventsController.joinEvent);
router.post("/:id/leave_event", eventsController.leaveEvent);
router.get("/:id/teams", eventsController.getTeams);
router.post("/:id/teams/create", eventsController.createTeam);
router.post("/:id/teams/delete", eventsController.deleteTeam);
router.post("/:id/teams/join", eventsController.joinTeam);
router.post("/:id/teams/leave", eventsController.leaveTeam);
router.post("/:id/challenges/create", eventsController.createChallenge);
router.post("/:id/challenges/:challenge_id/update", eventsController.updateChallenge);
router.get("/:id/challenges", eventsController.getChallenges);
router.post("/create", eventsController.createEvent);
router.get("/:id", eventsController.getEventById);
router.post("/:id/update", eventsController.updateEvent);
router.get("/", eventsController.getEvents);

export default router;