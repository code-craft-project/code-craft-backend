export const ORGANIZATION_SELECT_PROPS: string = 'organizations.id as id, organizations.name as name, organizations.type as type, organizations.creator_id as creator_id, organizations.profile_image_url as profile_image_url, organizations.updated_at as updated_at, organizations.created_at as created_at';
export const ORGANIZATION_JOIN_PROPS: string = "'id', organizations.id, 'name', organizations.name, 'type', organizations.type, 'creator_id', organizations.creator_id, 'profile_image_url', organizations.profile_image_url, 'created_at', organizations.created_at, 'updated_at', organizations.updated_at";
export const ORGANIZATION_CREATE_PROPS: string = 'name, type, creator_id, profile_image_url';

export interface OrganizationsRepositoryInterface {
    createOrganization(user: OrganizationEntity): Promise<InsertResultInterface | null>;
    getOrganizationById(id: number): Promise<OrganizationEntity | null>;
    getOrganizationByName(name: string): Promise<OrganizationEntity | null>;
    getOrganizationsByPage(page: number, limits: number): Promise<OrganizationEntity[] | null>;
};