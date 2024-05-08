import { Router } from "express";
import { uploadController } from "@/app/controllers";

const router = Router();

router.post("/image", uploadController.uploadImage);
router.post("/file", uploadController.uploadFile);

export default router;