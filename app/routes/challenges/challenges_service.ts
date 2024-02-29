import { challengesRepository } from "@/app/repositories";
import { challenge_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { Request, Response } from "express";

export async function getChallenges(req: Request, res: Response) {
    const { page, limits } = req.query;

    let offset = 0;
    let limit = 10;

    if (page) {
        offset = parseInt(page as string) || 0;
    }

    if (limits) {
        limit = parseInt(limits as string) || limit;
    }

    let data = await challengesRepository.getChallengesByPage(offset, limit);

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

export async function getChallengeById(req: Request, res: Response) {
    const { id } = req.params;

    let data = await challengesRepository.getChallengeById(parseInt(id));

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

export async function createChallenge(req: Request, res: Response) {
    const challenge: ChallengeInterface = req.body;

    let validate_result: ValidatorResult = challenge_validator.validate(challenge);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    const creator_id = req.user?.id as number;
    let result = await challengesRepository.createChallenge({ ...challenge, creator_id });
    if (!result) {
        res.status(200).json({ status: "error", message: "Can't create challenge, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: result });
}