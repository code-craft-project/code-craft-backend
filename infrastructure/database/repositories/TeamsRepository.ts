import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";
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

    async updateTeam(id: number, team: TeamEntity): Promise<InsertResultInterface | null> {
        let query = '';

        const params = [];
        const propertyNames = Object.getOwnPropertyNames(team);
        for (let i = 0; i < propertyNames.length; i++) {
            let property = propertyNames[i];
            query += `${property} = ?`;
            params.push((team as any)[property]);
            if (i < (propertyNames.length - 1)) {
                query += ',';
            }
        }

        let updateTeam = await this.database.query<InsertResultInterface>(`update teams set ${query} where id = ?;`, ...params, id);
        if (!updateTeam) {
            return null;
        }

        return updateTeam;
    }

    async getTeamById(id: number): Promise<TeamEntity | null> {
        const data = await this.database.query<TeamEntity[]>(`
        SELECT ${TEAM_SELECT_PROPS},
        JSON_OBJECT(${USER_JOIN_PROPS}) AS leader,
        (select count(*) from team_members where team_members.team_id = teams.id) as members,
        IFNULL(score, 0) AS score
        FROM 
            teams 
        LEFT JOIN 
            event_participants ON event_participants.id = teams.leader_id 
        LEFT JOIN 
            users ON event_participants.user_id = users.id 
        LEFT JOIN (
            SELECT 
                team_members.team_id, 
                SUM(event_challenges.score) AS score
            FROM 
                team_members
            JOIN 
                event_participants ON event_participants.id = team_members.event_participant_id
            JOIN 
                submissions ON submissions.user_id = event_participants.user_id
            JOIN 
                event_challenges ON event_challenges.challenge_id = submissions.challenge_id
            WHERE 
                submissions.status = 'correct'
            GROUP BY 
                team_members.team_id
        ) AS team_scores ON team_scores.team_id = teams.id
        WHERE 
            teams.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getTeamsByEventId(event_id: number): Promise<TeamEntity[] | null> {
        let data = await this.database.query<TeamEntity[]>(`SELECT 
        ${TEAM_SELECT_PROPS},
        JSON_OBJECT(${USER_JOIN_PROPS}) AS leader,
        (select count(*) from team_members where team_members.team_id = teams.id) as members,
        IFNULL(score, 0) AS score
        FROM 
            teams 
        LEFT JOIN 
            event_participants ON event_participants.id = teams.leader_id 
        LEFT JOIN 
            users ON event_participants.user_id = users.id 
        LEFT JOIN (
            SELECT 
                team_members.team_id, 
                SUM(event_challenges.score) AS score
            FROM 
                team_members
            JOIN 
                event_participants ON event_participants.id = team_members.event_participant_id
            JOIN 
                submissions ON submissions.user_id = event_participants.user_id
            JOIN 
                event_challenges ON event_challenges.challenge_id = submissions.challenge_id
            WHERE 
                submissions.status = 'correct'
            GROUP BY 
                team_members.team_id
        ) AS team_scores ON team_scores.team_id = teams.id
        WHERE 
            teams.event_id = ?;`, [event_id]);

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

    async getTeamsByPage(event_id: number, page: number = 0, limits: number = 10): Promise<TeamEntity[] | null> {
        let data = await this.database.query<TeamEntity[]>(`SELECT 
        ${TEAM_SELECT_PROPS},
        JSON_OBJECT(${USER_JOIN_PROPS}) AS leader,
        (select count(*) from team_members where team_members.team_id = teams.id) as members,
        IFNULL(score, 0) AS score
        FROM 
            teams 
        LEFT JOIN 
            event_participants ON event_participants.id = teams.leader_id 
        LEFT JOIN 
            users ON event_participants.user_id = users.id 
        LEFT JOIN (
            SELECT 
                team_members.team_id, 
                SUM(event_challenges.score) AS score
            FROM 
                team_members
            JOIN 
                event_participants ON event_participants.id = team_members.event_participant_id
            JOIN 
                submissions ON submissions.user_id = event_participants.user_id
            JOIN 
                event_challenges ON event_challenges.challenge_id = submissions.challenge_id
            WHERE 
                submissions.status = 'correct'
            GROUP BY 
                team_members.team_id
        ) AS team_scores ON team_scores.team_id = teams.id
        WHERE 
            teams.event_id = ? limit ?;`, event_id, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getUserTeamByEventId(user_id: number, event_id: number): Promise<TeamEntity | null> {
        const data = await this.database.query<TeamEntity[]>(`SELECT 
        ${TEAM_SELECT_PROPS},
        JSON_OBJECT(${USER_JOIN_PROPS}) AS leader,
        (select count(*) from team_members where team_members.team_id = teams.id) as members,
        IFNULL(score, 0) AS score
        FROM 
            teams 
        LEFT JOIN 
            event_participants ON event_participants.id = teams.leader_id 
        LEFT JOIN 
            users ON event_participants.user_id = users.id 
        LEFT JOIN (
            SELECT 
                team_members.team_id, 
                SUM(event_challenges.score) AS score
            FROM 
                team_members
            JOIN 
                event_participants ON event_participants.id = team_members.event_participant_id
            JOIN 
                submissions ON submissions.user_id = event_participants.user_id
            JOIN 
                event_challenges ON event_challenges.challenge_id = submissions.challenge_id
            WHERE 
                submissions.status = 'correct'
            GROUP BY 
                team_members.team_id
        ) AS team_scores ON team_scores.team_id = teams.id
        WHERE 
            teams.id in (select team_id from team_members join event_participants on team_members.event_participant_id = event_participants.id where event_participants.user_id = ?)
            and
            teams.event_id = ?;`, user_id, event_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }
}