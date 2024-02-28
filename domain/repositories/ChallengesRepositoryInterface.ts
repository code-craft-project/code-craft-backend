export const CHALLENGE_CREATE_PROPS: string = 'name, topic, level, is_public, type, creator_id';
export const CHALLENGE_SELECT_PROPS: string = 'challenges.id as id, name, topic, level, is_public, type, creator_id, challenges.created_at as created_at, challenges.updated_at as updated_at';

export interface ChallengesRepositoryInterface {
    createChallenge(challenge: ChallengeInterface): Promise<ChallengeInterface | null>;
    getChallengeById(id: number): Promise<ChallengeInterface | null>;
    getChallengesByPage(page: number, limits: number): Promise<ChallengeInterface[] | null>;
};