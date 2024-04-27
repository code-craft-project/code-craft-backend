export const CHALLENGE_CREATE_PROPS: string = 'title, description, topic, level, is_public, type, creator_id';
export const CHALLENGE_SELECT_PROPS: string = 'challenges.id as id, title, description, topic, level, is_public, type, creator_id, challenges.created_at as created_at, challenges.updated_at as updated_at';

export const COUNT_CHALLENGE_COMMENTS: string = '(SELECT COUNT(*) FROM challenge_comments WHERE challenge_comments.challenge_id = challenges.id) AS comments';
export const COUNT_CHALLENGE_SUBMISSIONS: string = '(SELECT COUNT(*) FROM submissions WHERE submissions.challenge_id = challenges.id) AS submissions';

export interface ChallengesRepositoryInterface {
    createChallenge(challenge: ChallengeEntity): Promise<InsertResultInterface | null>;
    getChallengeById(id: number): Promise<ChallengeEntity | null>;
    getChallengesByPage(page: number, limits: number): Promise<ChallengeEntity[] | null>;
    getChallengesByEventId(event_id: number): Promise<ChallengeEntity[] | null>;
    getChallengesByOrganizationId(organization_id: number): Promise<ChallengeEntity[] | null>;
    getEventChallengeById(event_id: number, challenge_id: number): Promise<ChallengeEntity | null>;
    getOrganizationLatestChallenges(organization_id: number): Promise<ChallengeEntity[] | null>;
};