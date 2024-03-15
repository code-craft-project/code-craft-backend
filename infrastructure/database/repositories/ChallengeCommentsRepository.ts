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
        from challenge_comments join users on user_id = users.id where challenge_comments.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getChallengeComments(challenge_id: number): Promise<ChallengeCommentEntity[] | null> {
        let data = await this.database.query<ChallengeCommentEntity[]>(`select 
            challenge_comments.id as cc_id,
            ${CHALLENGE_COMMENT_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = challenge_comments.id) AS likes,
            (SELECT COUNT(*) FROM challenge_comments WHERE challenge_comments.reply_to_comment_id = cc_id) AS replies
        from challenge_comments join users on user_id = users.id where challenge_comments.challenge_id = ? and challenge_comments.is_reply = false;`, [challenge_id]);

        if (data) {
            return data;
        }

        return null;
    }
}