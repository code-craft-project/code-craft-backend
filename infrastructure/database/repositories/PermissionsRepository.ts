import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { PERMISSION_CREATE_PROPS, PERMISSION_SELECT_PROPS, PermissionsRepositoryInterface } from "@/domain/repositories/PermissionsRepositoryInterface";

export default class PermissionsRepository implements PermissionsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createPermission(permission: PermissionEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into permissions (${PERMISSION_CREATE_PROPS}) values (?);`, [
            permission.permission,
            permission.entity_id,
            permission.user_id,
            permission.organization_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getPermissionById(permission_id: number): Promise<PermissionEntity | null> {
        let data = await this.database.query<PermissionEntity[]>(`select ${PERMISSION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from permissions join users on permissions.user_id = users.id from permissions where permissions.id = ?;`, [permission_id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async removePermissionById(permission_id: number): Promise<PermissionEntity | null> {
        let result = await this.database.query<PermissionEntity>(`delete from permissions where id = ?;`, [permission_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async removeOrganizationPermissionById(permission_id: number, organization_id: number): Promise<PermissionEntity | null> {
        let result = await this.database.query<PermissionEntity>(`delete from permissions where id = ? and organization_id = ?;`, permission_id, organization_id);

        if (result) {
            return result;
        }

        return null;
    }

    async getUserPermissionsByOrganizationId(user_id: number, organization_id: number): Promise<PermissionEntity[] | null> {
        let data = await this.database.query<PermissionEntity[]>(`select ${PERMISSION_SELECT_PROPS} from permissions where permissions.user_id = ? and permissions.organization_id = ?;`, user_id, organization_id);

        if (data) {
            return data;
        }

        return null;
    }

    async getOrganizationPermissions(organization_id: number): Promise<PermissionEntity[] | null> {
        let result = await this.database.query<PermissionEntity[]>(`select ${PERMISSION_SELECT_PROPS} from permissions where permissions.organization_id = ?;`, [organization_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async getPermissionByChallengeId(user_id: number, challenge_id: number): Promise<PermissionEntity | null> {
        let result = await this.database.query<PermissionEntity[]>(`select ${PERMISSION_SELECT_PROPS} from permissions where permission = 'challenge' and user_id = ? and entity_id = ?;`, user_id, challenge_id);

        if (result && result.length > 0) {
            return result[0];
        }

        return null;
    }

    async getPermissionByEventId(user_id: number, event_id: number): Promise<PermissionEntity | null> {
        let result = await this.database.query<PermissionEntity[]>(`select ${PERMISSION_SELECT_PROPS} from permissions where permission = 'event' and user_id = ? and entity_id = ?;`, user_id, event_id);

        if (result && result.length > 0) {
            return result[0];
        }

        return null;
    }

    async getPermissionByEntityId(user_id: number, entity_id: number, permission: "challenge" | "event"): Promise<PermissionEntity | null> {
        let result = await this.database.query<PermissionEntity[]>(`select ${PERMISSION_SELECT_PROPS} from permissions where permission = 'event' and user_id = ? and entity_id = ? and permission = ?;`, user_id, entity_id, permission);

        if (result && result.length > 0) {
            return result[0];
        }

        return null;
    }
}