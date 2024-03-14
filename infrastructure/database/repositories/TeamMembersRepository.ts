import { MySQLDatabase } from "../MySQLDatabase";
import { TEAM_MEMBER_CREATE_PROPS, TEAM_MEMBER_SELECT_PROPS, TeamMembersRepositoryInterface } from "@/domain/repositories/TeamMembersRepositoryInterface";

export default class TeamMembersRepository implements TeamMembersRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createTeamMember(teamMember: TeamMemberEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into team_members (${TEAM_MEMBER_CREATE_PROPS}) values (?);`, [
            teamMember.team_id,
            teamMember.event_participant_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getTeamMemberByEventId(event_id: number, user_id: number): Promise<TeamMemberEntity | null> {
        let data = await this.database.query<TeamMemberEntity[]>(`select ${TEAM_MEMBER_SELECT_PROPS} from team_members join teams on teams.id = team_members.team_id join event_participants on event_participants.id = team_members.event_participant_id where teams.event_id = ? and event_participants.user_id = ?;`, event_id, user_id);
        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async removeMembersByTeamId(team_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from team_members where team_id = ?;`, [team_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async removeTeamMemberById(id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from team_members where id = ?;`, [id]);

        if (result) {
            return result;
        }

        return null;
    }
}