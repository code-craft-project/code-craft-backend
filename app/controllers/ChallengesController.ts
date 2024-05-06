import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import { Request, Response } from "express";
import ChallengesService from "../services/ChallengesService";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";

export default class ChallengesController {
    challengesService: ChallengesService;
    challengeValidator: ChallengeValidator;

    constructor(challengesService: ChallengesService, challengeValidator: ChallengeValidator) {
        this.challengesService = challengesService;
        this.challengeValidator = challengeValidator;
    }

    getChallenges = async (req: Request, res: Response) => {
        const { page, limits } = req.query;

        let offset = 0;
        let limit = 10;

        if (page) {
            offset = parseInt(page as string) || 0;
        }

        if (limits) {
            limit = parseInt(limits as string) || limit;
        }

        let data = await this.challengesService.getChallengesByPage(offset, limit, req.user?.id);

        if (!data) {
            res.status(200).json({
                status: "success",
                message: "No data",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getChallengesByTopic = async (req: Request, res: Response) => {
        const { topic } = req.params;
        const { page, limits } = req.query;

        let offset = 0;
        let limit = 10;

        if (page) {
            offset = parseInt(page as string) || 0;
        }

        if (limits) {
            limit = parseInt(limits as string) || limit;
        }

        let data = await this.challengesService.getChallengesByTopic(topic as ChallengeTopic || "all topics", offset, limit);

        if (!data) {
            res.status(200).json({
                status: "success",
                data: []
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getChallengeById = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.challengesService.getChallengeById(parseInt(id));

        if (!data) {
            res.status(200).json({
                status: "error",
                message: "Challenge not found"
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    createChallenge = async (req: Request, res: Response) => {
        const challenge: ChallengeEntity = req.body;

        let validate_result: ValidatorResult = this.challengeValidator.validate(challenge);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const creator_id = req.user?.id as number;
        let result = await this.challengesService.createChallenge({ ...challenge, creator_id });
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't create challenge, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", data: result });
    }

    updateChallenge = async (req: Request, res: Response) => {
        const { id: challenge_id } = req.params;
        const updatedChallenge: ChallengeEntity = req.body;

        const allowedProperties = [
            "title",
            "description",
            "topic",
            "level",
            "is_public",
            "type",
        ];

        const propertyNames: string[] = Object.getOwnPropertyNames(updatedChallenge);
        for (let property of propertyNames) {
            if (!allowedProperties.includes(property)) {
                res.status(200).json({ status: "error", message: `Can't update ${property}` });
                return;
            }
        }

        const challenge = await this.challengesService.getChallengeById(parseInt(challenge_id));
        if (!challenge) {
            res.status(200).json({
                status: "error",
                message: "Challenge not found"
            });

            return;
        }

        const user = req.user;
        const hasPermissions = user?.id == challenge.creator_id;
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const updateEvent = await this.challengesService.updateChallenge(parseInt(challenge_id), updatedChallenge);
        if (!updateEvent) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Challenge updated successfully" });
    }

    getChallengeComments = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.challengesService.getComments(parseInt(id), req.user?.id);

        if (!data) {
            res.status(200).json({
                status: "error",
                message: "No challenge exists"
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getCommentById = async (req: Request, res: Response) => {
        const { comment_id } = req.params;

        let data = await this.challengesService.getCommentById(parseInt(comment_id));

        if (!data) {
            res.status(200).json({
                status: "error",
                message: "Comment not found"
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    createComment = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment) {
            res.status(200).json({ status: "error", message: "Comment is missing" });
            return;
        }

        const challenge = await this.challengesService.getChallengeById(parseInt(id));
        if (!challenge) {
            res.status(200).json({ status: "error", message: "Challenge not found" });
            return;
        }

        if (!challenge.is_public) {
            res.status(200).json({ status: "error", message: "Can't comment on private challenges" });
            return;
        }

        const user = req.user;

        const newComment: ChallengeCommentEntity = { comment, is_reply: false, challenge_id: parseInt(id), user_id: user?.id! };

        let result = await this.challengesService.postComment(newComment);
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't post comment, Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Comment posted successfully" });
    }

    toggleLikeAComment = async (req: Request, res: Response) => {
        const { comment_id } = req.params;

        const comment = await this.challengesService.getCommentById(parseInt(comment_id));
        if (!comment) {
            res.status(200).json({ status: "error", message: "Comment not found" });
            return;
        }

        const user = req.user;

        const like = await this.challengesService.getUserLikeByCommentId(user?.id!, parseInt(comment_id));
        if (like) {
            await this.challengesService.unLikeAnComment(like.id!);
            res.status(200).json({ status: "success", message: "Unliked the comment successfully" });
            return;
        }

        const newComment: CommentLikeEntity = { comment_id: parseInt(comment_id), user_id: user?.id! };

        let result = await this.challengesService.likeAnComment(newComment);
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't like a comment, Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Liked the comment successfully" });
    }

    replyToComment = async (req: Request, res: Response) => {
        const { comment_id } = req.params;
        const { comment } = req.body;

        const reply_to_comment_id = parseInt(comment_id);

        if (!comment) {
            res.status(200).json({ status: "error", message: "comment is missing" });
            return;
        }

        const doCommentExist = await this.challengesService.getCommentById(reply_to_comment_id);
        if (!doCommentExist) {
            res.status(200).json({ status: "error", message: "Comment not found" });
            return;
        }

        const user = req.user;
        const newComment: ChallengeCommentEntity = { comment, is_reply: true, reply_to_comment_id, challenge_id: doCommentExist.challenge_id, user_id: user?.id! };

        let result = await this.challengesService.postComment(newComment);
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't post comment, Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Reply to a comment successfully", data: result });
    }

    createTestCases = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { test_cases } = req.body;

        if (!test_cases) {
            res.status(200).json({ status: "error", message: "TestCases is missing" });
            return;
        }

        const challenge = await this.challengesService.getChallengeById(parseInt(id));
        if (!challenge) {
            res.status(200).json({ status: "error", message: "Challenge not found" });
            return;
        }

        const user = req.user;

        if (user?.id != challenge.creator_id) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        for (let i = 0; i < test_cases.length; i++) {
            await this.challengesService.createTestCase(parseInt(id), test_cases[i].inputs, test_cases[i].output);
        }

        res.status(200).json({ status: "success", message: "Test Cases created successfully" });
    }

    getTestCases = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.challengesService.getTestCases(parseInt(id));

        if (!data) {
            res.status(200).json({
                status: "error",
                message: "No Test Cases found"
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    getSubmissions = async (req: Request, res: Response) => {
        const { id } = req.params;

        const user = req.user!;
        let submissions = await this.challengesService.getSubmissions(user.id!, parseInt(id));

        if (!submissions) {
            res.status(200).json({
                status: "error",
                message: "Something went wrong"
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data: submissions
        });
    }
};