export const SUBMISSION_CREATE_PROPS: string = 'challenge_id, user_id, status, content';
export const SUBMISSION_SELECT_PROPS: string = 'submissions.challenge_id as challenge_id, submissions.user_id as user_id, submissions.status as status, submissions.content as content, submissions.created_at as created_at';

export interface SubmissionsRepositoryInterface {
    createSubmission(submission: SubmissionEntity): Promise<InsertResultInterface | null>;
    getSubmissionById(id: number): Promise<SubmissionEntity | null>;
    getUserSubmissionsByChallengeId(user_id: number, challengeId: number): Promise<SubmissionEntity[] | null>;
};