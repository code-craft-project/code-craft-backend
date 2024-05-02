import { Router } from "express";
import { uploadController } from "@/app/controllers";

const router = Router();

router.post("/image", uploadController.uploadImage);

export default router;