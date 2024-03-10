export const EVENT_CREATE_PROPS: string = 'title, description, is_public, password, logo_url, start_at, end_at, organization_id';
export const EVENT_SELECT_PROPS: string = 'events.id as id, title, description, is_public, password, logo_url, start_at, end_at, organization_id';

export interface EventsRepositoryInterface {
    createEvent(event: EventEntity): Promise<InsertResultInterface | null>;
    getEventById(id: number): Promise<EventEntity | null>;
    getEventsByPage(page: number, limits: number): Promise<EventEntity[] | null>;
};