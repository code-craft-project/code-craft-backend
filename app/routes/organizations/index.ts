import { Router } from "express";
import { addOrganizationMember, createOrganization, getOrganizationById, getOrganizations, givePermission, removeOrganizationMember } from "./organizations_service";

const router = Router();

router.post("/create", createOrganization);
router.post("/:id/give_permission", givePermission);
router.post("/:id/add_member", addOrganizationMember);
router.post("/:id/remove_member", removeOrganizationMember);
router.get("/:id", getOrganizationById);
router.get("/", getOrganizations);

export default router;