export const ORGANIZATION_CHALLENGE_CREATE_PROPS: string = 'organization_id, challenge_id';
export const ORGANIZATION_CHALLENGE_SELECT_PROPS: string = 'organization_challenges.id as id, organization_challenges.organization_id as organization_id, organization_challenges.challenge_id as challenge_id';

export interface OrganizationChallengesRepositoryInterface {
    createOrganizationChallenge(organizationChallenge: OrganizationChallengeEntity): Promise<InsertResultInterface | null>;
    removeOrganizationChallenge(organizationChallenge: OrganizationChallengeEntity): Promise<InsertResultInterface | null>;
};