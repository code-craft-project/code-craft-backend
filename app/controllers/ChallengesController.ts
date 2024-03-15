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

        let data = await this.challengesService.getChallengesByPage(offset, limit);

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

    getChallengeById = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.challengesService.getChallengeById(parseInt(id));

        if (!data) {
            res.status(200).json({
                status: "success",
                message: "Challenge not found",
                data: []
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

    getChallengeComments = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.challengesService.getComments(parseInt(id));

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

        res.status(200).json({ status: "success", message: "Reply to a comment successfully" });
    }
};