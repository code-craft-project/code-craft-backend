import { eventsRepository } from "@/app/repositories";
import { event_validator } from "@/app/validators";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import { Request, Response } from "express";

export async function getEvents(req: Request, res: Response) {
    const { page, limits } = req.query;

    let offset = 0;
    let limit = 10;

    if (page) {
        offset = parseInt(page as string) || 0;
    }

    if (limits) {
        limit = parseInt(limits as string) || limit;
    }

    let data = await eventsRepository.getEventsByPage(offset, limit);

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

export async function getEventById(req: Request, res: Response) {
    const { id } = req.params;

    let data = await eventsRepository.getEventById(parseInt(id));

    if (!data) {
        res.status(200).json({
            status: "success",
            message: "Event not found",
            data: []
        });

        return;
    }

    res.status(200).json({
        status: "success",
        data
    });
}

export async function createEvent(req: Request, res: Response) {
    const event: EventInterface = req.body;

    let validate_result: ValidatorResult = event_validator.validate(event);
    if (!validate_result.is_valid) {
        res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
        return;
    }

    // FIXME: check if user has permissions
    let result = await eventsRepository.createEvent(event);
    if (!result) {
        res.status(200).json({ status: "error", message: "Can't create event, something went wrong" });
        return;
    }

    res.status(200).json({ status: "success", data: result });
}