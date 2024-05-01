import OrganizationValidator from "@/infrastructure/validators/OrganizationValidator";
import { Request, Response } from "express";
import OrganizationsService from "../services/OrganizationsService";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import MembersService from "../services/MembersService";
import MemberValidator from "@/infrastructure/validators/MemberValidator";
import PermissionValidator from "@/infrastructure/validators/PermissionValidator";
import ChallengesService from "../services/ChallengesService";
import EventsService from "../services/EventsService";
import PermissionsService from "../services/PermissionsService";
import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";

export interface OrganizationsControllerConfig {
    organizationsService: OrganizationsService;
    membersService: MembersService;
    challengesService: ChallengesService;
    eventsService: EventsService;
    permissionsService: PermissionsService;
    organizationValidator: OrganizationValidator;
    memberValidator: MemberValidator;
    permissionValidator: PermissionValidator;
    challengeValidator: ChallengeValidator;
};

export default class OrganizationsController {
    organizationsService: OrganizationsService;
    membersService: MembersService;
    challengesService: ChallengesService;
    eventsService: EventsService;
    permissionsService: PermissionsService;
    organizationValidator: OrganizationValidator;
    memberValidator: MemberValidator;
    permissionValidator: PermissionValidator;
    challengeValidator: ChallengeValidator;

    constructor(organizationsControllerConfig: OrganizationsControllerConfig) {
        this.organizationsService = organizationsControllerConfig.organizationsService;
        this.membersService = organizationsControllerConfig.membersService;
        this.challengesService = organizationsControllerConfig.challengesService;
        this.eventsService = organizationsControllerConfig.eventsService;
        this.permissionsService = organizationsControllerConfig.permissionsService;
        this.organizationValidator = organizationsControllerConfig.organizationValidator;
        this.memberValidator = organizationsControllerConfig.memberValidator;
        this.permissionValidator = organizationsControllerConfig.permissionValidator;
        this.challengeValidator = organizationsControllerConfig.challengeValidator;
    }

    getOrganizations = async (req: Request, res: Response) => {
        const { page, limits } = req.query;

        let offset = 0;
        let limit = 10;

        if (page) {
            offset = parseInt(page as string) || 0;
        }

        if (limits) {
            limit = parseInt(limits as string) || limit;
        }

        let data = await this.organizationsService.getOrganizationsByPage(offset, limit);

        if (!data) {
            res.status(200).json({
                status: "success",
                message: "No data",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getUserOrganizations  = async (req: Request, res: Response) => {
        const user_id = req.user?.id;
        let data = await this.organizationsService.getOrganizationsByUserId(user_id as number);

        if (!data) {
            res.status(200).json({
                status: "success",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getOrganizationById = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.organizationsService.getOrganizationById(parseInt(id));

        if (!data) {
            res.status(200).json({
                status: "error",
                message: "Organization not found",
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    createOrganization = async (req: Request, res: Response) => {
        const organization: OrganizationEntity = req.body;

        let validate_result: ValidatorResult = this.organizationValidator.validate(organization);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const organizations = await this.organizationsService.getOrganizationByName(organization.name);
        if (organizations) {
            res.status(200).json({ status: "error", message: "Name already in use" });
            return;
        }

        const creator_id = req.user?.id as number;
        let result = await this.organizationsService.createOrganization({ ...organization, creator_id });
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't create organization, something went wrong" });
            return;
        }

        const member = await this.membersService.createMember({ role: 'admin', user_id: creator_id, organization_id: result.id! });
        if (!member) {
            res.status(200).json({ status: "error", message: "Can't create admin member, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", data: result });
    }

    updateOrganization = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;
        const organization: OrganizationEntity = req.body;

        const allowedProperties = ["name", "description"];
        const propertyNames: string[] = Object.getOwnPropertyNames(organization);
        for (let property of propertyNames) {
            if (!allowedProperties.includes(property)) {
                res.status(200).json({ status: "error", message: `Can't update ${property}` });
                return;
            }
        }

        let data = await this.organizationsService.getOrganizationById(parseInt(organization_id));
        if (!data) {
            res.status(200).json({
                status: "error",
                message: "Organization not found"
            });

            return;
        }

        const user = req.user;

        const hasPermissions = await this.membersService.isAdmin(user?.id!, parseInt(organization_id));

        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const updateJobPost = await this.organizationsService.updateOrganization(parseInt(organization_id), organization);
        if (!updateJobPost) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Organization updated successfully" });
    }

    addOrganizationMember = async (req: Request, res: Response) => {
        const organization_id: number = parseInt(req.params.id);
        const member: MemberEntity = req.body;

        let validate_result: ValidatorResult = this.memberValidator.validate(member);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const user_id: number = req.user?.id as number;

        const hasPermissions: boolean = await this.membersService.isAdmin(user_id, organization_id);
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const organization_member_exist = await this.membersService.getMemberByOrganizationId(member.user_id, organization_id);
        if (organization_member_exist) {
            res.status(200).json({ status: "error", message: "Member already exist" });
            return;
        }

        const new_member = await this.membersService.createMember({ ...member, organization_id });
        if (!new_member) {
            res.status(200).json({ status: "error", message: "Can't add new member, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", data: new_member });
    }

    removeOrganizationMember = async (req: Request, res: Response) => {
        const organization_id: number = parseInt(req.params.id);
        const member_id: number = req.body.member_id;

        if (!member_id) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: ['missing member_id'] });
            return;
        }

        const user_id = req.user?.id as number;

        const organization_member_ = await this.membersService.getMemberByOrganizationId(user_id, organization_id);
        if (!organization_member_ || organization_member_.id == member_id || organization_member_.role != "admin") {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const remove_organization_member = await this.membersService.removeOrganizationMemberById(member_id, organization_id);
        if (!remove_organization_member) {
            res.status(200).json({ status: "error", message: "Can't remove member, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", data: remove_organization_member });
    }

    givePermission = async (req: Request, res: Response) => {
        const organization_id: number = parseInt(req.params.id);
        const permission: PermissionEntity = req.body;

        let validate_result: ValidatorResult = this.permissionValidator.validate(permission);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const user_id = req.user?.id as number;

        let has_permission = false;
        if (permission.permission == 'challenge') {
            const organization_member_ = await this.membersService.getMemberByOrganizationId(user_id, organization_id);
            if (!organization_member_ || (organization_member_.role != "challenges_manager" && organization_member_.role != "admin")) {
                res.status(200).json({ status: "error", message: "You don't have permissions" });
                return;
            }

            const challenge = await this.challengesService.getChallengeById(permission.entity_id);
            if (!challenge) {
                res.status(200).json({ status: "error", message: "Challenge does not exist" });
                return;
            }

            has_permission = true;
        }

        if (!has_permission && permission.permission == 'event') {
            const organization_member_ = await this.membersService.getMemberByOrganizationId(user_id, organization_id);
            if (!organization_member_ || (organization_member_.role != "events_manager" && organization_member_.role != "admin")) {
                res.status(200).json({ status: "error", message: "You don't have permissions" });
                return;
            }

            const event = await this.eventsService.getEventById(permission.entity_id);
            if (!event) {
                res.status(200).json({ status: "error", message: "Event does not exist" });
                return;
            }

            if (event.organization_id != organization_id) {
                res.status(200).json({ status: "error", message: "You don't have permissions" });
                return;
            }
        }

        const permission_exist = await this.permissionsService.getPermissionByEntityId(permission.user_id, permission.entity_id, permission.permission);
        if (permission_exist) {
            res.status(200).json({ status: "error", message: "User Already has that permission" });
            return;
        }

        const organization_permission = await this.permissionsService.createPermission({ ...permission, organization_id });
        if (!organization_permission) {
            res.status(200).json({ status: "error", message: "Can't create organization_permission, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", data: organization_permission });
    }

    getJobPosts = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;

        let data = await this.organizationsService.getOrganizationJobPosts(parseInt(organization_id));

        if (!data) {
            res.status(200).json({
                status: "success",
                message: "No data",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getJobPostApplications = async (req: Request, res: Response) => {
        const { id: organization_id, job_post_id } = req.params;

        const user = req.user;

        const organizationMember = await this.membersService.isJobPostsManager(user?.id!, parseInt(organization_id));
        if (!organizationMember) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const data = await this.organizationsService.getJobPostApplications(parseInt(job_post_id));

        if (!data) {
            res.status(200).json({
                status: "success",
                message: "No data",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getEvents = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;
        const { page, limits } = req.query;

        let offset = 0;
        let limit = 10;

        if (page) {
            offset = parseInt(page as string) || 0;
        }

        if (limits) {
            limit = parseInt(limits as string) || limit;
        }

        const user = req.user;

        const hasPermissions = await this.membersService.isEventsManager(user?.id!, parseInt(organization_id));

        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        let data = await this.organizationsService.getEvents(parseInt(organization_id), offset, limit);

        if (!data) {
            res.status(200).json({
                status: "success",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getChallenges = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;

        const user = req.user;

        const hasPermissions = await this.membersService.isChallengesManager(user?.id!, parseInt(organization_id));

        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const challenges = await this.organizationsService.getChallenges(parseInt(organization_id));

        res.status(200).json({ status: "success", data: challenges });
    }

    createChallenge = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;
        const challenge: ChallengeEntity = req.body;

        let validate_result: ValidatorResult = this.challengeValidator.validate(challenge);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const organization = await this.organizationsService.getOrganizationById(parseInt(organization_id));
        if (!organization) {
            res.status(200).json({ status: "error", message: "Organization does not exist" });
            return;
        }

        const user_id = req.user?.id as number;

        const hasPermissions = await this.membersService.isChallengesManager(user_id, organization.id as number);
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const creator_id = req.user?.id as number;
        let result = await this.organizationsService.createChallenge(parseInt(organization_id), { ...challenge, creator_id });
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't create challenge, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Challenge created successfully" });
    }

    getMembers = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;

        const user = req.user;

        const hasPermissions = await this.membersService.isAdmin(user?.id!, parseInt(organization_id));

        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }
        const members = await this.membersService.getOrganizationMembers(parseInt(organization_id));

        res.status(200).json({ status: "success", data: members });
    }

    getMemberByUser = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;

        const user = req.user;

        const member = await this.membersService.getMemberByOrganizationId(user?.id as number, parseInt(organization_id));
        if (!member) {
            return res.status(200).json({ status: "error", message: 'You are not a member' });
        }

        res.status(200).json({ status: "success", data: member });
    }

    getOrganizationDashboard = async (req: Request, res: Response) => {
        const { id: organization_id } = req.params;

        // Check if user has permissions
        const user = req.user;
        const member = await this.membersService.getMemberByOrganizationId(user?.id as number, parseInt(organization_id));
        if (!member) {
            return res.status(200).json({ status: "error", message: 'You are not a member' });
        }

        // Fetch dashboard stats
        const organizationDashboardStats = await this.organizationsService.getOrganizationDashboard(parseInt(organization_id));

        res.status(200).json({ status: "success", data: organizationDashboardStats });
    }
};