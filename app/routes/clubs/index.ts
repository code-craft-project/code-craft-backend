import { Router } from "express";
import { createClub, getClubs, getClubById } from "./clubs_service";

const router = Router();

router.post("/create", createClub);
router.get("/:id", getClubById);
router.get("/", getClubs);

export default router;