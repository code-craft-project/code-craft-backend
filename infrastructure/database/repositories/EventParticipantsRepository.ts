import { EVENT_PARTICIPANT_CREATE_PROPS, EVENT_PARTICIPANT_SELECT_PROPS, EventParticipantsRepositoryInterface } from "@/domain/repositories/EventParticipantsRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";

export default class EventParticipantsRepository implements EventParticipantsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createEventParticipant(eventParticipant: EventParticipantEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into event_participants (${EVENT_PARTICIPANT_CREATE_PROPS}) values (?);`, [
            eventParticipant.event_id,
            eventParticipant.user_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getEventParticipantByUserId(user_id: number, event_id: number): Promise<EventParticipantEntity | null> {
        let data = await this.database.query<EventParticipantEntity[]>(`select ${EVENT_PARTICIPANT_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user, JSON_OBJECT(${USER_JOIN_PROPS}) AS event from event_participants join users on event_participants.user_id = users.id where event_participants.event_id = ? and event_participants.user_id = ?;`, event_id, user_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async removeEventParticipant(eventParticipant: EventParticipantEntity): Promise<EventParticipantEntity | null> {
        let result = await this.database.query<EventParticipantEntity>(`delete from event_participants where event_id = ? and user_id = ?;`, eventParticipant.event_id, eventParticipant.user_id);

        if (result) {
            return result;
        }

        return null;
    }
}