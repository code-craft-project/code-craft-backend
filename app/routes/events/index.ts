import { Router } from "express";
import { eventsController } from "@/app/controllers";

const router = Router();

router.post("/:id/join_event", eventsController.joinEvent);
router.post("/:id/leave_event", eventsController.leaveEvent);
router.post("/:id/team/create", eventsController.createTeam);
router.post("/:id/team/delete", eventsController.deleteTeam);
router.post("/:id/team/join", eventsController.joinTeam);
router.post("/:id/team/leave", eventsController.leaveTeam);
router.post("/:id/challenges/create", eventsController.createChallenge);
router.post("/create", eventsController.createEvent);
router.get("/:id", eventsController.getEventById);
router.post("/:id/update", eventsController.updateEvent);
router.get("/", eventsController.getEvents);

export default router;