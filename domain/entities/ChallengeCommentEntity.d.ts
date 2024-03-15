interface ChallengeCommentEntity {
    id?: number;
    comment: string;
    user_id: number;
    challenge_id: number;
    is_reply: boolean;
    reply_to_comment_id?: number;
    likes?: number;
    replies?: number;
    created_at?: string;
};