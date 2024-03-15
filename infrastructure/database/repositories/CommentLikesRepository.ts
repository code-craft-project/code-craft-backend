import { MySQLDatabase } from "../MySQLDatabase";
import { COMMENT_LIKE_CREATE_PROPS, COMMENT_LIKE_SELECT_PROPS, CommentLikesRepositoryInterface } from "@/domain/repositories/CommentLikesRepositoryInterface";

export default class CommentLikesRepository implements CommentLikesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createLike(commentLike: CommentLikeEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into comment_likes (${COMMENT_LIKE_CREATE_PROPS}) values (?);`, [
            commentLike.comment_id,
            commentLike.user_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async deleteLike(comment_like_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from comment_likes where id = ?;`, [comment_like_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async getUserLikeByCommentId(user_id: number, comment_id: number): Promise<CommentLikeEntity | null> {
        let data = await this.database.query<CommentLikeEntity[]>(`select ${COMMENT_LIKE_SELECT_PROPS} from comment_likes where user_id = ? and comment_id = ?;`, user_id, comment_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }
}