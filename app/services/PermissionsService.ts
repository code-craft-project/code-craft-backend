import PermissionsRepository from "@/infrastructure/database/repositories/PermissionsRepository";

export default class PermissionsService {
    permissionsRepository: PermissionsRepository;

    constructor(permissionsRepository: PermissionsRepository) {
        this.permissionsRepository = permissionsRepository;
    }

    async createPermission(permission: PermissionEntity): Promise<InsertResultInterface | null> {
        return await this.permissionsRepository.createPermission(permission);
    }

    async getPermissionById(id: number): Promise<PermissionEntity | null> {
        return await this.permissionsRepository.getPermissionById(id);
    }

    async getOrganizationPermissions(organization_id: number): Promise<PermissionEntity[] | null> {
        return await this.permissionsRepository.getOrganizationPermissions(organization_id);
    }

    async getPermissionByChallengeId(user_id: number, challenge_id: number): Promise<PermissionEntity | null> {
        return await this.permissionsRepository.getPermissionByChallengeId(user_id, challenge_id);
    }

    async getPermissionByEntityId(user_id: number, entity_id: number, permission: "challenge" | "event"): Promise<PermissionEntity | null> {
        return await this.permissionsRepository.getPermissionByEntityId(user_id, entity_id, permission);
    }

    async getPermissionByEventId(user_id: number, event_id: number): Promise<PermissionEntity | null> {
        return await this.permissionsRepository.getPermissionByEventId(user_id, event_id);
    }

    async getUserPermissionsByOrganizationId(user_id: number, organization_id: number): Promise<PermissionEntity[] | null> {
        return await this.permissionsRepository.getUserPermissionsByOrganizationId(user_id, organization_id);
    }

    async removeOrganizationPermissionById(permission_id: number, organization_id: number): Promise<PermissionEntity | null> {
        return await this.permissionsRepository.removeOrganizationPermissionById(permission_id, organization_id);
    }

    async removePermissionById(permission_id: number): Promise<PermissionEntity | null> {
        return await this.permissionsRepository.removePermissionById(permission_id);
    }

};