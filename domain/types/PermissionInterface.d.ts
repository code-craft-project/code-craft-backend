interface PermissionInterface {
    id?: number;
    permission: 'challenge' | 'event';
    entity_id: string;
    user_id: string;
    organization_id: string;
};