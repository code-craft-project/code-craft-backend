export const COMMENT_LIKE_CREATE_PROPS: string = 'comment_id, user_id';
export const COMMENT_LIKE_SELECT_PROPS: string = 'comment_likes.id as id, comment_id, comment_likes.user_id as user_id';

export interface CommentLikesRepositoryInterface {
    createLike(commentLike: CommentLikeEntity): Promise<InsertResultInterface | null>;
    deleteLike(comment_like_id: number): Promise<InsertResultInterface | null>;
    getUserLikeByCommentId(user_id: number, comment_id: number): Promise<CommentLikeEntity | null>;
};