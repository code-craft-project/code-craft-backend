import { Router } from "express";
import { sign_in, sign_up } from "./auth_service";

const router = Router();

router.post("/sign_in", sign_in);
router.post("/sign_up", sign_up);

export default router;