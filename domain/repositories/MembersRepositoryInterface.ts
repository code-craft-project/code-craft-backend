export const MEMBER_CREATE_PROPS: string = 'role, user_id, organization_id';
export const MEMBER_SELECT_PROPS: string = 'members.id as id, role, user_id, members.organization_id as organization_id,members.created_at as created_at, members.updated_at as updated_at';

export interface MembersRepositoryInterface {
    createMember(member: MemberEntity): Promise<InsertResultInterface | null>;

    getMemberById(member_id: number): Promise<MemberEntity | null>;
    removeOrganizationMemberById(member_id: number, organization_id: number): Promise<MemberEntity | null>;
    getMemberByOrganizationId(user_id: number, organization_id: number): Promise<MemberEntity | null>;

    getOrganizationMembers(organization_id: number): Promise<MemberEntity[] | null>;
};