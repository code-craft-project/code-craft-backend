import { Router } from "express";
import { authController } from "@/app/controllers";

const router = Router();

router.post("/sign_in", authController.signIn);
router.post("/sign_up", authController.signUp);
router.post("/sign_out", authController.signOut);

export default router;