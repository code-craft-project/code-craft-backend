import EventValidator from "@/infrastructure/validators/EventValidator";
import { Request, Response } from "express";
import EventsService from "../services/EventsService";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import MembersService from "../services/MembersService";

export default class EventsController {
    eventsService: EventsService;
    membersService: MembersService;
    eventValidator: EventValidator;

    constructor(eventsService: EventsService, membersService: MembersService, eventValidator: EventValidator) {
        this.eventsService = eventsService;
        this.membersService = membersService;
        this.eventValidator = eventValidator;
    }

    async getEvents(req: Request, res: Response) {
        const { page, limits } = req.query;

        let offset = 0;
        let limit = 10;

        if (page) {
            offset = parseInt(page as string) || 0;
        }

        if (limits) {
            limit = parseInt(limits as string) || limit;
        }

        let data = await this.eventsService.getEventsByPage(offset, limit);

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

    async getEventById(req: Request, res: Response) {
        const { id } = req.params;

        let data = await this.eventsService.getEventById(parseInt(id));

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

    async createEvent(req: Request, res: Response) {
        const event: EventEntity = req.body;

        let validate_result: ValidatorResult = this.eventValidator.validate(event);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const user_id = req.user?.id as number;

        const hasPermissions = await this.membersService.isEventsManager(user_id, event.organization_id);
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        let result = await this.eventsService.createEvent(event);
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't create event, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", data: result });
    }

    async updateEvent(req: Request, res: Response) {
        const { id } = req.params;
        const event: EventEntity = req.body;

        let data = await this.eventsService.getEventById(parseInt(id));

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
};