import { MySQLDatabase } from "../MySQLDatabase";
import { EVENT_CREATE_PROPS, EVENT_SELECT_PROPS, EventsRepositoryInterface } from "@/domain/repositories/EventsRepositoryInterface";

export default class EventsRepository implements EventsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createEvent(event: EventEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into events (${EVENT_CREATE_PROPS}) values (?);`, [
            event.title,
            event.description,
            event.is_public,
            event.password,
            event.logo_url,
            new Date(event.start_at),
            new Date(event.end_at),
            event.organization_id
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getEventById(id: number): Promise<EventEntity | null> {
        let data = await this.database.query<EventEntity[]>(`select ${EVENT_SELECT_PROPS} from events where events.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getEventsByPage(page: number = 0, limits: number = 10): Promise<EventEntity[] | null> {
        let data = await this.database.query<EventEntity[]>(`select ${EVENT_SELECT_PROPS} from events limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }
}