import { clubsRepository } from "@/app/repositories";
import { club_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { Request, Response } from "express";

export async function getClubs(req: Request, res: Response) {
    const { page, limits } = req.query;

    let offset = 0;
    let limit = 10;

    if (page) {
        offset = parseInt(page as string) || 0;
    }

    if (limits) {
        limit = parseInt(limits as string) || limit;
    }

    let data = await clubsRepository.getClubsByPage(offset, limit);

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

export async function getClubById(req: Request, res: Response) {
    const { id } = req.params;

    let data = await clubsRepository.getClubById(parseInt(id));

    if (!data) {
        res.status(200).json({
            status: "success",
            message: "Club not found",
            data: []
        });

        return;
    }

    res.status(200).json({
        status: "success",
        data
    });
}

export async function createClub(req: Request, res: Response) {
    const club: ClubInterface = req.body;

    let validate_result: ValidatorResult = club_validator.validate(club);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    const clubs = await clubsRepository.getClubByName(club.name);
    if(clubs){
        res.status(200).json({ status: "error", message: "Name already in use" });
        return;
    }

    const leader_id = req.user?.id as number;
    let result = await clubsRepository.createClub({ ...club, leader_id });
    if (!result) {
        res.status(200).json({ status: "error", message: "Can't create club, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: result });
}