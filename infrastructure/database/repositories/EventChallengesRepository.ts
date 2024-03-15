import { MySQLDatabase } from "../MySQLDatabase";
import { EVENT_CHALLENGE_CREATE_PROPS, EventChallengesRepositoryInterface } from "@/domain/repositories/EventChallengesRepositoryInterface";

export default class EventChallengesRepository implements EventChallengesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createEventChallenge(eventChallenge: EventChallengeEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into event_challenges (${EVENT_CHALLENGE_CREATE_PROPS}) values (?);`, [
            eventChallenge.event_id,
            eventChallenge.challenge_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async removeEventChallenge(eventChallenge: EventChallengeEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from event_challenges where event_id = ? and challenge_id = ?;`, eventChallenge.event_id, eventChallenge.challenge_id);

        if (result) {
            return result;
        }

        return null;
    }
}