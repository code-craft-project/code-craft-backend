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
};