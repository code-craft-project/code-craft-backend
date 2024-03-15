import { usersController } from "@/app/controllers";
import { Router } from "express";

const router = Router();

router.get("/:id", usersController.getUserById);
router.post("/", usersController.updateUser);
router.get("/", usersController.getCurrentUser);

export default router;