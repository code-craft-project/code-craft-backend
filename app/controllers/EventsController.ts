import EventValidator from "@/infrastructure/validators/EventValidator";
import { Request, Response } from "express";
import EventsService from "../services/EventsService";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import MembersService from "../services/MembersService";
import TeamValidator from "@/infrastructure/validators/TeamValidator";

export default class EventsController {
    eventsService: EventsService;
    membersService: MembersService;
    eventValidator: EventValidator;
    teamValidator: TeamValidator;

    constructor(eventsService: EventsService, membersService: MembersService, eventValidator: EventValidator, teamValidator: TeamValidator) {
        this.eventsService = eventsService;
        this.membersService = membersService;
        this.eventValidator = eventValidator;
        this.teamValidator = teamValidator;
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

    async joinEvent(req: Request, res: Response) {
        const { id: event_id } = req.params;
        const { password } = req.body;

        const event = await this.eventsService.getEventById(parseInt(event_id));
        if (!event) {
            res.status(200).json({ status: "error", message: "Event does not exist" });
            return;
        }

        if (!event.is_public) {
            if (event.password != password) {
                res.status(200).json({ status: "error", message: "Wrong Password" });
                return;
            }
        }

        const user_id = req.user?.id as number;

        const didUserJoin = await this.eventsService.didUserJoin(parseInt(event_id), user_id);
        if (didUserJoin) {
            res.status(200).json({ status: "error", message: "You already there" });
            return;
        }

        const eventParticipation = await this.eventsService.joinEvent(parseInt(event_id), user_id);
        if (!eventParticipation) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "You have joined the event successfully", data: eventParticipation });
    }

    async leaveEvent(req: Request, res: Response) {
        const { id: event_id } = req.params;

        const user_id = req.user?.id as number;
        const leaveEvent = await this.eventsService.leaveEvent(parseInt(event_id), user_id);
        if (!leaveEvent) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "You have leaved the event successfully", data: leaveEvent });
    }

    async createTeam(req: Request, res: Response) {
        const { id: event_id } = req.params;

        const team: TeamEntity = req.body;

        let validate_result: ValidatorResult = this.teamValidator.validate(team);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const event = await this.eventsService.getEventById(parseInt(event_id));
        if (!event) {
            res.status(200).json({ status: "error", message: "No event found" });
            return;
        }

        if (!event.is_team_based) {
            res.status(200).json({ status: "error", message: "This event is not team based" });
            return;
        }

        const user_id = req.user?.id as number;

        const eventParticipant = await this.eventsService.didUserJoin(parseInt(event_id), user_id);
        if (!eventParticipant) {
            res.status(200).json({ status: "error", message: "You need to join the event first" });
            return;
        }

        const teamMemeber = await this.eventsService.getTeamMemberByEventId(parseInt(event_id), user_id);
        if (teamMemeber) {
            res.status(200).json({ status: "error", message: "You are already in a team" });
            return;
        }

        const newTeam = await this.eventsService.createTeam(team);
        if (!newTeam) {
            res.status(200).json({ status: "error", message: "Something went wrong while creating a team" });
            return;
        }

        res.status(200).json({ status: "success", message: "You have leaved the event successfully", data: newTeam });
    }

    async deleteTeam(req: Request, res: Response) {
        const { team_id } = req.body;

        const team = await this.eventsService.getTeamById(parseInt(team_id));
        if (!team) {
            res.status(200).json({ status: "error", message: "No Team Found" });
            return;
        }

        const user_id = req.user?.id as number;
        if (team.leader_id != user_id) {
            res.status(200).json({ status: "error", message: "Only the leader can delete the team" });
            return;
        }

        await this.eventsService.deleteTeam(parseInt(team_id));

        res.status(200).json({ status: "success", message: "Team deleted successfuly" });
    }

    async joinTeam(req: Request, res: Response) {
        const { id: event_id } = req.params;
        const { team_id, password } = req.body;

        const user_id = req.user?.id as number;

        const eventParticipant = await this.eventsService.getParticipantByUserId(parseInt(event_id), user_id);
        if (!eventParticipant) {
            res.status(200).json({ status: "error", message: "You need to join the event first" });
            return;
        }

        const teamMember = await this.eventsService.getTeamMemberByEventId(parseInt(event_id), user_id);
        if (teamMember) {
            res.status(200).json({ status: "error", message: "You already in a team" });
            return;
        }

        const team = await this.eventsService.getTeamById(team_id);
        if (!team) {
            res.status(200).json({ status: "error", message: "Team does not exist" });
            return;
        }

        if (team.event_id != parseInt(event_id)) {
            res.status(200).json({ status: "error", message: "This team is not part of this event" });
            return;
        }

        if (team.is_private) {
            if (team.password != password) {
                res.status(200).json({ status: "error", message: "Wrong Team Password" });
                return;
            }
        }

        const joinTeamResult = await this.eventsService.joinTeam(team_id, eventParticipant.id!);

        res.status(200).json({ status: "success", message: "Join team success", data: joinTeamResult });
    }

    async leaveTeam(req: Request, res: Response) {
        const { id: event_id } = req.params;

        const user_id = req.user?.id as number;

        const teamMember = await this.eventsService.getTeamMemberByEventId(parseInt(event_id), user_id);
        if (!teamMember) {
            res.status(200).json({ status: "error", message: "You are not a member of this team" });
            return;
        }

        const leaveTeamResult = await this.eventsService.leaveTeam(teamMember.id!);

        res.status(200).json({ status: "success", message: "Leaving successfuly", data: leaveTeamResult });
    }
};