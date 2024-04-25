import ChallengeCommentsRepository from "@/infrastructure/database/repositories/ChallengeCommentsRepository";
import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import CommentLikesRepository from "@/infrastructure/database/repositories/CommentLikesRepository";
import SubmissionsRepository from "@/infrastructure/database/repositories/SubmissionsRepository";
import TestCaseInputsRepository from "@/infrastructure/database/repositories/TestCaseInputsRepository";
import TestCasesRepository from "@/infrastructure/database/repositories/TestCasesRepository";

export default class ChallengesService {
    challengesRepository: ChallengesRepository;
    challengeCommentsRepository: ChallengeCommentsRepository;
    commentLikesRepository: CommentLikesRepository;
    testCasesRepository: TestCasesRepository;
    testCaseInputsRepository: TestCaseInputsRepository;
    submissionsRepository: SubmissionsRepository;

    constructor(challengesRepository: ChallengesRepository, challengeCommentsRepository: ChallengeCommentsRepository, commentLikesRepository: CommentLikesRepository, testCasesRepository: TestCasesRepository, testCaseInputsRepository: TestCaseInputsRepository, submissionsRepository: SubmissionsRepository) {
        this.challengesRepository = challengesRepository;
        this.challengeCommentsRepository = challengeCommentsRepository;
        this.commentLikesRepository = commentLikesRepository;
        this.testCasesRepository = testCasesRepository;
        this.testCaseInputsRepository = testCaseInputsRepository;
        this.submissionsRepository = submissionsRepository;
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

    async getTestCases(challenge_id: number): Promise<TestCaseEntity[] | null> {
        return await this.testCasesRepository.getTestCasesByChallengeId(challenge_id);
    }

    async createTestCase(challenge_id: number, inputs: TestCaseInputEntity[], output: string): Promise<InsertResultInterface | null> {
        const testCaseResult = await this.testCasesRepository.createTestCase({ challenge_id, output });
        const promise = inputs.map(input => this.testCaseInputsRepository.createTestCaseInput(input));

        await Promise.all(promise);

        return testCaseResult;
    }

    async getSubmissions(user_id: number, challenge_id: number): Promise<SubmissionEntity[] | null> {
        return await this.submissionsRepository.getUserSubmissionsByChallengeId(user_id, challenge_id);
    }
};