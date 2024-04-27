import { usersController } from "@/app/controllers";
import { Router } from "express";

const router = Router();

router.post("/me", usersController.updateUser);
router.get("/me", usersController.getCurrentUser);
router.get("/:id", usersController.getUserById);

export default router;