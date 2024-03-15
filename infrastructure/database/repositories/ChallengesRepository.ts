import { CHALLENGE_CREATE_PROPS, CHALLENGE_SELECT_PROPS, ChallengesRepositoryInterface } from "@/domain/repositories/ChallengesRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";

export default class ChallengesRepository implements ChallengesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }
    // name, topic, level, is_public, type, creator_id
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
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from challenges join users on creator_id = users.id where challenges.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getChallengesByPage(page: number = 0, limits: number = 10): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from challenges join users on creator_id = users.id where challenges.id not in (select challenge_id from event_challenges) limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getChallengesByEventId(event_id: number): Promise<ChallengeEntity[] | null> {
        let data = await this.database.query<ChallengeEntity[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from challenges join event_challenges on event_challenges.challenge_id = challenges.id join users on creator_id = users.id where event_challenges.event_id = ?;`, [event_id]);
        if (!data) {
            return null;
        }

        return data;
    }
}