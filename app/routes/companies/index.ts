import { Router } from "express";
import { createCompany, getCompanies, getCompanyById } from "./companies_service";

const router = Router();

router.post("/create", createCompany);
router.get("/:id", getCompanyById);
router.get("/", getCompanies);

export default router;