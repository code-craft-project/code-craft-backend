export const CHALLENGE_COMMENT_CREATE_PROPS: string = 'comment, user_id, challenge_id, is_reply, reply_to_comment_id';
export const CHALLENGE_COMMENT_SELECT_PROPS: string = 'challenge_comments.id as id, challenge_comments.comment as comment, challenge_comments.user_id as user_id, challenge_comments.challenge_id as challenge_id, challenge_comments.is_reply as is_reply, challenge_comments.reply_to_comment_id as reply_to_comment_id, challenge_comments.created_at as created_at';

export interface ChallengeCommentsRepositoryInterface {
    createChallengeComment(challengeComment: ChallengeCommentEntity): Promise<InsertResultInterface | null>;
    getChallengeCommentById(id: number): Promise<ChallengeCommentEntity | null>;
    getChallengeComments(challenge_id: number): Promise<ChallengeCommentEntity[] | null>;
};