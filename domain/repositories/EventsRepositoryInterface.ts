export const EVENT_CREATE_PROPS: string = 'title, description, is_public, password, logo_url, start_at, end_at, organization_id, is_team_based, max_team_members';
export const EVENT_JOIN_PROPS: string = "'id', events.id, 'title', events.title, 'description', events.description, 'is_public', events.is_public, 'password', events.password, 'logo_url', events.log_url, 'start_at', events.start_at, 'end_at', events.end_at, 'is_team_based', events.is_team_based, 'max_team_members'. events.max_team_members";
export const EVENT_SELECT_PROPS: string = 'events.id as id, title, description, is_public, password, logo_url, start_at, end_at, organization_id, is_team_based, max_team_members';

export interface EventsRepositoryInterface {
    createEvent(event: EventEntity): Promise<InsertResultInterface | null>;
    getEventById(id: number): Promise<EventEntity | null>;
    getEventsByPage(page: number, limits: number): Promise<EventEntity[] | null>;
    updateEvent(id: number, event: EventEntity): Promise<InsertResultInterface | null>;
};