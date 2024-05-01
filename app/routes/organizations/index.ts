import { Router } from "express";
import { organizationsController } from "@/app/controllers";

const router = Router();

router.post("/create", organizationsController.createOrganization);
router.post("/:id/update", organizationsController.updateOrganization);
router.post("/:id/give_permission", organizationsController.givePermission);
router.get("/:id/members", organizationsController.getMembers);
router.get("/:id/members/me", organizationsController.getMemberByUser);
router.post("/:id/add_member", organizationsController.addOrganizationMember);
router.post("/:id/remove_member", organizationsController.removeOrganizationMember);
router.get("/:id/job_posts", organizationsController.getJobPosts);
router.get("/:id/job_posts/:job_post_id/applications", organizationsController.getJobPostApplications);
router.get("/:id/events", organizationsController.getEvents);
router.post("/:id/challenges/create", organizationsController.createChallenge);
router.get("/:id/challenges", organizationsController.getChallenges);
router.get("/:id/dashboard", organizationsController.getOrganizationDashboard);
router.get("/me", organizationsController.getUserOrganizations);
router.get("/:id", organizationsController.getOrganizationById);
router.get("/", organizationsController.getOrganizations);

export default router;