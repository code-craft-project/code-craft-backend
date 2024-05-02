import { Router } from "express";
import { filesServeController } from "@/app/controllers";

const router = Router();

router.get("/images/:file_name", filesServeController.serveImage);

export default router;