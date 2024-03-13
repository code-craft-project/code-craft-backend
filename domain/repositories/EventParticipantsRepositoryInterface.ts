export const EVENT_PARTICIPANT_CREATE_PROPS: string = 'event_id, user_id';
export const EVENT_PARTICIPANT_SELECT_PROPS: string = 'event_participants.id as id, event_participants.event_id as event_id, event_participants.user_id as user_id';

export interface EventParticipantsRepositoryInterface {
    getEventParticipantByUserId(user_id: number, event_id: number): Promise<EventParticipantEntity | null>;
    createEventParticipant(eventParticipant: EventParticipantEntity): Promise<InsertResultInterface | null>;
    removeEventParticipant(eventParticipant: EventParticipantEntity): Promise<EventParticipantEntity | null>;
};