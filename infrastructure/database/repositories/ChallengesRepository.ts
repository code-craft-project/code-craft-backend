import { CHALLENGE_CREATE_PROPS, CHALLENGE_SELECT_PROPS, ChallengesRepositoryInterface } from "@/domain/repositories/ChallengesRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";

export default class ChallengesRepository implements ChallengesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }
    // name, topic, level, is_public, type, creator_id
    async createChallenge(challenge: ChallengeInterface): Promise<ChallengeInterface | null> {
        let result = await this.database.query<ChallengeInterface>(`insert into challenges (${CHALLENGE_CREATE_PROPS}) values (?);`, [
            challenge.name,
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

    async getChallengeById(id: number): Promise<ChallengeInterface | null> {
        let data = await this.database.query<ChallengeInterface[]>(`select ${CHALLENGE_SELECT_PROPS} from challenges where id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getChallengesByPage(page: number = 0, limits: number = 10): Promise<ChallengeInterface[] | null> {
        let data = await this.database.query<ChallengeInterface[]>(`select ${CHALLENGE_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS creator from challenges join users on creator_id = users.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }
}