export const TEAM_CREATE_PROPS: string = 'name, description, is_private, password, leader_id, event_id';
export const TEAM_SELECT_PROPS: string = 'teams.id as id, name, description, is_private, password, leader_id, teams.event_id';

export interface TeamsRepositoryInterface {
    createTeam(team: TeamEntity): Promise<InsertResultInterface | null>;
    getTeamById(id: number): Promise<TeamEntity | null>;
    getTeamsByEventId(event_id: number): Promise<TeamEntity[] | null>;
    removeTeamById(team_id: number): Promise<InsertResultInterface | null>;
};