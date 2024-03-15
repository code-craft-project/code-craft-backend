export const EVENT_CHALLENGE_CREATE_PROPS: string = 'event_id, challenge_id';
export const EVENT_CHALLENGE_SELECT_PROPS: string = 'event_challenges.id as id, event_challenges.event_id as event_id, event_challenges.challenge_id as challenge_id';

export interface EventChallengesRepositoryInterface {
    createEventChallenge(eventChallenge: EventChallengeEntity): Promise<InsertResultInterface | null>;
    removeEventChallenge(eventChallenge: EventChallengeEntity): Promise<InsertResultInterface | null>;
};