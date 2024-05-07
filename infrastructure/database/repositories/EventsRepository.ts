import { ORGANIZATION_JOIN_PROPS } from "@/domain/repositories/OrganizationsRepositoryInterface";
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
            event.organization_id,
            event.is_team_based,
            event.max_team_members
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getEventById(id: number, user_id: number = 0): Promise<EventEntity | null> {
        let data = await this.database.query<EventEntity[]>(`select 
        ${EVENT_SELECT_PROPS},
        JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization,
        case when (select user_id from event_participants where event_participants.user_id = ? and event_participants.event_id = ?) then true else false end as didJoin
        from events join organizations on organization_id = organizations.id where events.id = ?;`, user_id, id, id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getEventsByPage(page: number = 0, limits: number = 10): Promise<EventEntity[] | null> {
        let data = await this.database.query<EventEntity[]>(`select ${EVENT_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from events join organizations on organization_id = organizations.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async updateEvent(id: number, event: EventEntity): Promise<InsertResultInterface | null> {
        let query = '';

        const params = [];
        const propertyNames = Object.getOwnPropertyNames(event);
        for (let i = 0; i < propertyNames.length; i++) {
            let property = propertyNames[i];
            query += `${property} = ?`;
            params.push((event as any)[property]);
            if (i < (propertyNames.length - 1)) {
                query += ',';
            }
        }

        let updateEvent = await this.database.query<InsertResultInterface>(`update events set ${query} where id = ?;`, ...params, id);
        if (!updateEvent) {
            return null;
        }

        return updateEvent;
    }

    async getOrganizationEventsByPage(organization_id: number, page: number, limits: number) {
        let data = await this.database.query<EventEntity[]>(`select ${EVENT_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from events join organizations on organization_id = organizations.id where organization_id = ? limit ?;`, organization_id, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async getOrganizationLatestEvents(organization_id: number): Promise<EventEntity[] | null> {
        let data = await this.database.query<EventEntity[]>(`select ${EVENT_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from events join organizations on organization_id = organizations.id where organization_id = ? order by events.created_at limit 3;`, organization_id);
        if (!data) {
            return null;
        }

        return data;
    }

    async searchEvents(query: string): Promise<EventEntity[] | null> {
        const searchQuery = `%${query}%`;
        let data = await this.database.query<EventEntity[]>(`select ${EVENT_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from events join organizations on organization_id = organizations.id where events.title like ? or events.description like ? or organizations.name like ?;`, searchQuery, searchQuery, searchQuery);
        if (!data) {
            return null;
        }

        return data;
    }
}