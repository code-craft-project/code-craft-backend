import ChallengeCommentsRepository from "@/infrastructure/database/repositories/ChallengeCommentsRepository";
import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import CommentLikesRepository from "@/infrastructure/database/repositories/CommentLikesRepository";

export default class ChallengesService {
    challengesRepository: ChallengesRepository;
    challengeCommentsRepository: ChallengeCommentsRepository;
    commentLikesRepository: CommentLikesRepository;

    constructor(challengesRepository: ChallengesRepository, challengeCommentsRepository: ChallengeCommentsRepository, commentLikesRepository: CommentLikesRepository) {
        this.challengesRepository = challengesRepository;
        this.challengeCommentsRepository = challengeCommentsRepository;
        this.commentLikesRepository = commentLikesRepository;
    }

    async createChallenge(challenge: ChallengeEntity): Promise<InsertResultInterface | null> {
        return await this.challengesRepository.createChallenge(challenge);
    }

    async updateChallenge(challenge_id: number, challenge: ChallengeEntity): Promise<InsertResultInterface | null> {
        return await this.challengesRepository.updateChallenge(challenge_id, challenge);
    }

    async getChallengeById(id: number): Promise<ChallengeEntity | null> {
        return await this.challengesRepository.getChallengeById(id);
    }

    async getChallengesByPage(page?: number, limits?: number): Promise<ChallengeEntity[] | null> {
        return await this.challengesRepository.getChallengesByPage(page, limits);
    }

    async getComments(challenge_id: number): Promise<ChallengeCommentEntity[] | null> {
        return await this.challengeCommentsRepository.getChallengeComments(challenge_id);
    }

    async getCommentById(comment_id: number): Promise<ChallengeCommentEntity | null> {
        return await this.challengeCommentsRepository.getChallengeCommentById(comment_id);
    }

    async postComment(comment: ChallengeCommentEntity): Promise<InsertResultInterface | null> {
        return await this.challengeCommentsRepository.createChallengeComment(comment);
    }

    async likeAnComment(commentLike: CommentLikeEntity): Promise<InsertResultInterface | null> {
        return await this.commentLikesRepository.createLike(commentLike);
    }

    async unLikeAnComment(comment_like_id: number): Promise<InsertResultInterface | null> {
        return await this.commentLikesRepository.deleteLike(comment_like_id);
    }

    async getUserLikeByCommentId(user_id: number, comment_id: number): Promise<CommentLikeEntity | null> {
        return await this.commentLikesRepository.getUserLikeByCommentId(user_id, comment_id);
    }
};