import { usersController } from "@/app/controllers";
import { Router } from "express";

const router = Router();

router.get("/my_progress", usersController.getUserProgress);
router.get("/me/skills", usersController.getUserSkills);
router.post("/me/skills/create", usersController.createUserSkill);
router.post("/me/skills/:id/delete", usersController.deleteUserSkillById);
router.post("/me", usersController.updateUser);
router.get("/me", usersController.getCurrentUser);
router.get("/:id/skills", usersController.getUserSkillsById);
router.get("/:id", usersController.getUserById);

export default router;