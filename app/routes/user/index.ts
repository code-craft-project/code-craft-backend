import { usersController } from "@/app/controllers";
import { Router } from "express";

const router = Router();

router.get("/my_progress", usersController.getUserProgress);
router.post("/me", usersController.updateUser);
router.get("/me", usersController.getCurrentUser);
router.get("/:id", usersController.getUserById);

export default router;