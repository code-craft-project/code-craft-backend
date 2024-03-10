import { Router } from "express";
import { eventsController } from "@/app/controllers";

const router = Router();

router.post("/create", eventsController.createEvent);
router.get("/:id", eventsController.getEventById);
router.post("/:id", eventsController.updateEvent);
router.get("/", eventsController.getEvents);

export default router;