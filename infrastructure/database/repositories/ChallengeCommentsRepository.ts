import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";
import { CHALLENGE_COMMENT_CREATE_PROPS, CHALLENGE_COMMENT_SELECT_PROPS, ChallengeCommentsRepositoryInterface } from "@/domain/repositories/ChallengeCommentsRepositoryInterface";

export default class ChallengeCommentsRepository implements ChallengeCommentsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createChallengeComment(challengeComment: ChallengeCommentEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into challenge_comments (${CHALLENGE_COMMENT_CREATE_PROPS}) values (?);`, [
            challengeComment.comment,
            challengeComment.user_id,
            challengeComment.challenge_id,
            challengeComment.is_reply,
            challengeComment.reply_to_comment_id
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getChallengeCommentById(id: number): Promise<ChallengeCommentEntity | null> {
        let data = await this.database.query<ChallengeCommentEntity[]>(`
        select 
            challenge_comments.id as cc_id,
            ${CHALLENGE_COMMENT_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = challenge_comments.id) AS likes,
            (SELECT COUNT(*) FROM challenge_comments WHERE challenge_comments.reply_to_comment_id = cc_id) AS replies
        from challenge_comments left join users on user_id = users.id where challenge_comments.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getChallengeComments(challenge_id: number, user_id: number = 0): Promise<ChallengeCommentEntity[] | null> {
        let data = await this.database.query<ChallengeCommentEntity[]>(`
        SELECT 
        challenge_comments.id as cc_id,
        ${CHALLENGE_COMMENT_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user,
    (SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = cc_id) AS likes,
    (SELECT COUNT(*) FROM challenge_comments WHERE challenge_comments.reply_to_comment_id = cc_id) AS replies,
    case when (select user_id from comment_likes where user_id = ? and challenge_comments.id = comment_likes.comment_id) then true else false end as didLike,
    CASE
        WHEN COUNT(reply.id) > 0 THEN
        JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', reply.id,
            'user_id', reply.user_id,
            'user', JSON_OBJECT('id', reply_user.id, 'username', reply_user.username, 'first_name', reply_user.first_name, 'last_name', reply_user.last_name, 'email', reply_user.email, 'password', reply_user.password, 'profile_image_url', reply_user.profile_image_url, 'created_at', reply_user.created_at, 'updated_at', reply_user.updated_at ),'challenge_id', reply.challenge_id,
            'comment', reply.comment,
            'is_reply', reply.is_reply,
            'reply_to_comment_id', reply.reply_to_comment_id,
            'created_at', reply.created_at
        )
    ) ELSE
    JSON_ARRAY()
END AS replies_details
FROM 
    challenge_comments 
LEFT JOIN 
    users ON user_id = users.id 
LEFT JOIN 
    challenge_comments AS reply ON challenge_comments.id = reply.reply_to_comment_id
LEFT JOIN 
    users AS reply_user ON reply.user_id = reply_user.id
WHERE 
    challenge_comments.challenge_id = ?
    AND challenge_comments.is_reply = false
GROUP BY 
    challenge_comments.id
ORDER BY 
    challenge_comments.created_at DESC;
`, user_id, challenge_id);

        if (data) {
            return data;
        }

        return null;
    }
}