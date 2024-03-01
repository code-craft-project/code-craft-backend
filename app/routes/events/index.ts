import { Router } from "express";
import { createEvent, getEventById, getEvents } from "./events_service";

const router = Router();

router.post("/create", createEvent);
router.get("/:id", getEventById);
router.get("/", getEvents);

export default router;