import { CHALLENGE_CREATE_PROPS, CHALLENGE_SELECT_PROPS, COUNT_CHALLENGE_COMMENTS, COUNT_CHALLENGE_SUBMISSIONS, ChallengesRepositoryInterface } from "@/domain/repositories/ChallengesRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";

export default class ChallengesRepository implements ChallengesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createChallenge(challenge: ChallengeEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into challenges (${CHALLENGE_CREATE_PROPS}) values (?);`, [
            challenge.title,
            challenge.description,
            challenge.topic,
            challenge.level,
            challenge.is_public,
            challenge.type,
            challenge.creator_id
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getChallengeById(id: number): Promise<ChallengeEntity | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join users on creator_id = users.id where challenges.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getChallengesByPage(page: number = 0, limits: number = 10, user_id: number = 0): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`SELECT 
        ${CHALLENGE_SELECT_PROPS},
        JSON_OBJECT(${USER_JOIN_PROPS}) AS creator,
        ${COUNT_CHALLENGE_COMMENTS},
        ${COUNT_CHALLENGE_SUBMISSIONS},
        CASE 
            WHEN EXISTS (SELECT 1 FROM submissions WHERE challenge_id = challenges.id AND user_id = ? AND status = 'correct') THEN 'done'
            WHEN EXISTS (SELECT 1 FROM submissions WHERE challenge_id = challenges.id AND user_id = ?) THEN 'wrong answer'
            ELSE 'not started'
        END AS status
    FROM 
        challenges
    JOIN 
        users ON creator_id = users.id
    WHERE 
        challenges.id NOT IN (SELECT challenge_id FROM event_challenges)
    LIMIT ?;`, user_id, user_id, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getChallengesByEventId(event_id: number): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join event_challenges on event_challenges.challenge_id = challenges.id join users on creator_id = users.id where event_challenges.event_id = ?;`, [event_id]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getChallengesByOrganizationId(organization_id: number): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join organization_challenges on organization_challenges.challenge_id = challenges.id join users on creator_id = users.id where organization_challenges.organization_id = ?;`, [organization_id]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getEventChallengeById(event_id: number, challenge_id: number): Promise<ChallengeEntity | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join users on creator_id = users.id join event_challenges on event_challenges.challenge_id = challenges.id where event_challenges.challenge_id = ? and event_challenges.event_id = ?;`, challenge_id, event_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async updateChallenge(id: number, challenge: ChallengeEntity): Promise<InsertResultInterface | null> {
        let query = '';

        const params = [];
        const propertyNames = Object.getOwnPropertyNames(challenge);
        for (let i = 0; i < propertyNames.length; i++) {
            let property = propertyNames[i];
            query += `${property} = ?`;
            params.push((challenge as any)[property]);
            if (i < (propertyNames.length - 1)) {
                query += ',';
            }
        }

        let updateChallenge = await this.database.query<InsertResultInterface>(`update challenges set ${query} where id = ?;`, ...params, id);
        if (!updateChallenge) {
            return null;
        }

        return updateChallenge;
    }

    async getOrganizationLatestChallenges(organization_id: number): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join organization_challenges on organization_challenges.challenge_id = challenges.id join users on creator_id = users.id where organization_challenges.organization_id = ? order by challenges.created_at desc limit 3;`, [organization_id]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getChallengesByTopic(topic: ChallengeTopic, page?: number | undefined, limits?: number | undefined): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join users on creator_id = users.id where challenges.id not in (select challenge_id from event_challenges) and topic = ? limit ?;`, topic, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getEventChallengesByTopic(event_id: number, topic: ChallengeTopic): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join event_challenges on event_challenges.challenge_id = challenges.id join users on creator_id = users.id where event_challenges.event_id = ? and challenges.topic = ?;`, event_id, topic);
        if (!data) {
            return null;
        }

        return data;
    }

    async getOrganizationChallengeById(organization_id: number, challenge_id: number): Promise<ChallengeEntity | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator, ${COUNT_CHALLENGE_COMMENTS}, ${COUNT_CHALLENGE_SUBMISSIONS} from challenges join users on creator_id = users.id join organization_challenges on organization_challenges.challenge_id = challenges.id where organization_challenges.challenge_id = ? and organization_challenges.organization_id = ?;`, challenge_id, organization_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async removeChallengeById(challenge_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from challenges where id = ?;`, challenge_id);

        if (result) {
            return result;
        }

        return null;
    }

    async searchChallenges(query: string, user_id: number = 0): Promise<ChallengeEntity[] | null> {
        const searchQuery = `%${query}%`;
        let data = await this.database.query<ChallengeEntity[]>(`SELECT 
        ${CHALLENGE_SELECT_PROPS},
        JSON_OBJECT(${USER_JOIN_PROPS}) AS creator,
        ${COUNT_CHALLENGE_COMMENTS},
        ${COUNT_CHALLENGE_SUBMISSIONS},
        CASE 
            WHEN EXISTS (SELECT 1 FROM submissions WHERE challenge_id = challenges.id AND user_id = ? AND status = 'correct') THEN 'done'
            WHEN EXISTS (SELECT 1 FROM submissions WHERE challenge_id = challenges.id AND user_id = ?) THEN 'wrong answer'
            ELSE 'not started'
        END AS status
    FROM 
        challenges
    JOIN 
        users ON creator_id = users.id
    WHERE 
        challenges.id NOT IN (SELECT challenge_id FROM event_challenges)
    AND challenges.title like ? or challenges.description like ? or challenges.topic like ?;`, user_id, user_id, searchQuery, searchQuery, searchQuery);
        if (!data) {
            return null;
        }

        return data;
    }
}