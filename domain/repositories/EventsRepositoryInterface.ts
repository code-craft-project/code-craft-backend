export const EVENT_CREATE_PROPS: string = 'title, description, is_public, password, logo_url, start_at, end_at';
export const EVENT_SELECT_PROPS: string = 'events.id as id, title, description, is_public, password, logo_url, start_at, end_at';

export interface EventsRepositoryInterface {
    createEvent(event: EventInterface): Promise<EventInterface | null>;
    getEventById(id: number): Promise<EventInterface | null>;
    getEventsByPage(page: number, limits: number): Promise<EventInterface[] | null>;
};