export const PERMISSION_CREATE_PROPS: string = 'permission, entity_id, user_id, organization_id';
export const PERMISSION_SELECT_PROPS: string = 'permissions.id as id, organization_id, permission, entity_id, permissions.user_id as user_id, permissions.created_at as created_at';

export interface PermissionsRepositoryInterface {
    createPermission(permission: PermissionInterface): Promise<InsertResultInterface | null>;

    getPermissionById(permission_id: number): Promise<PermissionInterface | null>;
    removePermissionById(permission_id: number): Promise<PermissionInterface | null>;
    removeOrganizationPermissionById(permission_id: number, organization_id: number): Promise<PermissionInterface | null>;

    getUserPermissionsByOrganizationId(user_id: number, organization_id: number): Promise<PermissionInterface[] | null>;
    getOrganizationPermissions(organization_id: number): Promise<PermissionInterface[] | null>;

    getPermissionByChallengeId(user_id: number, challenge_id: number): Promise<PermissionInterface | null>;
    getPermissionByEventId(user_id: number, event_id: number): Promise<PermissionInterface | null>;

    getPermissionByEntityId(user_id: number, entity_id: number, permission: 'challenge' | 'event'): Promise<PermissionInterface | null>;
};