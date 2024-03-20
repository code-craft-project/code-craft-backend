import { Router } from "express";
import { organizationsController } from "@/app/controllers";

const router = Router();

router.post("/create", organizationsController.createOrganization);
router.post("/:id/give_permission", organizationsController.givePermission);
router.post("/:id/add_member", organizationsController.addOrganizationMember);
router.post("/:id/remove_member", organizationsController.removeOrganizationMember);
router.get("/:id/job_posts", organizationsController.getJobPosts);
router.get("/:id/job_posts/:job_post_id/applications", organizationsController.getJobPostApplications);
router.get("/:id", organizationsController.getOrganizationById);
router.get("/", organizationsController.getOrganizations);

export default router;