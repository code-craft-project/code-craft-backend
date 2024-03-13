export const TEAM_MEMBER_CREATE_PROPS: string = 'team_id, event_participant_id';
export const TEAM_MEMBER_SELECT_PROPS: string = 'team_members.id as id, team_id, event_participant_id';

export interface TeamMembersRepositoryInterface {
    createTeamMember(teamMember: TeamMemberEntity): Promise<InsertResultInterface | null>;
    getTeamMemberByEventId(event_id: number, user_id: number): Promise<TeamMemberEntity | null>;
    removeMembersByTeamId(team_id: number): Promise<InsertResultInterface | null>;
};