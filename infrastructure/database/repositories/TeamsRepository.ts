import { MySQLDatabase } from "../MySQLDatabase";
import { TEAM_CREATE_PROPS, TEAM_SELECT_PROPS, TeamsRepositoryInterface } from "@/domain/repositories/TeamsRepositoryInterface";

export default class TeamsRepository implements TeamsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createTeam(team: TeamEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into teams (${TEAM_CREATE_PROPS}) values (?);`, [
            team.name,
            team.description,
            team.is_private,
            team.password,
            team.leader_id,
            team.event_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getTeamById(id: number): Promise<TeamEntity | null> {
        const data = await this.database.query<TeamEntity[]>(`select ${TEAM_SELECT_PROPS} from teams where id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getTeamsByEventId(event_id: number): Promise<TeamEntity[] | null> {
        let data = await this.database.query<TeamEntity[]>(`select ${TEAM_SELECT_PROPS} from teams where event_id = ?;`, [event_id]);

        if (data) {
            return data;
        }

        return null;
    }

    async removeTeamById(team_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from teams where id = ?;`, [team_id]);

        if (result) {
            return result;
        }

        return null;
    }
}