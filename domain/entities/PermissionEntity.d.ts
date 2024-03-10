interface PermissionEntity {
    id?: number;
    permission: 'challenge' | 'event';
    entity_id: number;
    user_id: number;
    organization_id: number;
};