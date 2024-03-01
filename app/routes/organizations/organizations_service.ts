import { organizationsRepository, membersRepository, permissionsRepository, challengesRepository, eventsRepository } from "@/app/repositories";
import { organization_validator, member_validator, permissions_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { Request, Response } from "express";

export async function getOrganizations(req: Request, res: Response) {
    const { page, limits } = req.query;

    let offset = 0;
    let limit = 10;

    if (page) {
        offset = parseInt(page as string) || 0;
    }

    if (limits) {
        limit = parseInt(limits as string) || limit;
    }

    let data = await organizationsRepository.getOrganizationsByPage(offset, limit);

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

export async function getOrganizationById(req: Request, res: Response) {
    const { id } = req.params;

    let data = await organizationsRepository.getOrganizationById(parseInt(id));

    if (!data) {
        res.status(200).json({
            status: "success",
            message: "Comapny not found",
            data: []
        });

        return;
    }

    res.status(200).json({
        status: "success",
        data
    });
}

export async function createOrganization(req: Request, res: Response) {
    const organization: OrganizationInterface = req.body;

    let validate_result: ValidatorResult = organization_validator.validate(organization);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    const organizations = await organizationsRepository.getOrganizationByName(organization.name);
    if (organizations) {
        res.status(200).json({ status: "error", message: "Name already in use" });
        return;
    }

    const creator_id = req.user?.id as number;
    let result = await organizationsRepository.createOrganization({ ...organization, creator_id });
    if (!result) {
        res.status(200).json({ status: "error", message: "Can't create organization, something went wrong" });
        return;
    }

    const member = await membersRepository.createMember({ role: 'admin', user_id: creator_id, organization_id: result.insertId });
    if (!member) {
        res.status(200).json({ status: "error", message: "Can't create admin member, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: result });
}

export async function addOrganizationMember(req: Request, res: Response) {
    const organization_id: string = req.params.id;
    const member: MemberInterface = req.body;

    let validate_result: ValidatorResult = member_validator.validate(member);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    const user_id = req.user?.id as number;

    const organization_member_ = await membersRepository.getMemberByOrganizationId(user_id, parseInt(organization_id));
    if (!organization_member_ || organization_member_.role != "admin") {
        res.status(200).json({ status: "error", message: "You don't have permissions" });
        return;
    }

    const organization_member_exist = await membersRepository.getMemberByOrganizationId(member.user_id, parseInt(organization_id));
    if (organization_member_exist) {
        res.status(200).json({ status: "error", message: "Member already exist" });
        return;
    }

    const new_member = await membersRepository.createMember({ ...member, organization_id: parseInt(organization_id) });
    if (!new_member) {
        res.status(200).json({ status: "error", message: "Can't add new member, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: new_member });
}

export async function removeOrganizationMember(req: Request, res: Response) {
    const organization_id: string = req.params.id;
    const member_id: string = req.body.member_id;

    if (!member_id) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: ['missing member_id'] });
        return;
    }

    const user_id = req.user?.id as number;

    const organization_member_ = await membersRepository.getMemberByOrganizationId(user_id, parseInt(organization_id));
    if (!organization_member_ || organization_member_.id == parseInt(member_id) || organization_member_.role != "admin") {
        res.status(200).json({ status: "error", message: "You don't have permissions" });
        return;
    }

    const remove_organization_member = await membersRepository.removeOrganizationMemberById(parseInt(member_id), parseInt(organization_id));
    if (!remove_organization_member) {
        res.status(200).json({ status: "error", message: "Can't remove member, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: remove_organization_member });
}

export async function givePermission(req: Request, res: Response) {
    const organization_id: string = req.params.id;
    const permission: PermissionInterface = req.body;

    let validate_result: ValidatorResult = permissions_validator.validate(permission);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    const user_id = req.user?.id as number;

    let has_permission = false;
    if (permission.permission == 'challenge') {
        const organization_member_ = await membersRepository.getMemberByOrganizationId(user_id, parseInt(organization_id));
        if (!organization_member_ || (organization_member_.role != "challenges_manager" && organization_member_.role != "admin")) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const challenge = await challengesRepository.getChallengeById(parseInt(permission.entity_id));
        if (!challenge) {
            res.status(200).json({ status: "error", message: "Challenge does not exist" });
            return;
        }

        has_permission = true;
    }

    if (!has_permission && permission.permission == 'event') {
        const organization_member_ = await membersRepository.getMemberByOrganizationId(user_id, parseInt(organization_id));
        if (!organization_member_ || (organization_member_.role != "events_manager" && organization_member_.role != "admin")) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const event = await eventsRepository.getEventById(parseInt(permission.entity_id));
        if (!event) {
            res.status(200).json({ status: "error", message: "Event does not exist" });
            return;
        }

        if(parseInt(event.organization_id) != parseInt(organization_id)){
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }
    }

    const permission_exist = await permissionsRepository.getPermissionByEntityId(parseInt(permission.user_id), parseInt(permission.entity_id), permission.permission);
    if (permission_exist) {
        res.status(200).json({ status: "error", message: "User Already has that permission" });
        return;
    }

    const organization_permission = await permissionsRepository.createPermission({ ...permission, organization_id });
    if (!organization_permission) {
        res.status(200).json({ status: "error", message: "Can't create organization_permission, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: organization_permission });
}