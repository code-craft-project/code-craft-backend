import EventValidator from "@/infrastructure/validators/EventValidator";
import { Request, Response } from "express";
import EventsService from "../services/EventsService";
import { ValidatorResult } from "@/domain/validator/ValidatorResult";
import MembersService from "../services/MembersService";
import TeamValidator from "@/infrastructure/validators/TeamValidator";
import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import ChallengesService from "../services/ChallengesService";

export default class EventsController {
    eventsService: EventsService;
    membersService: MembersService;
    eventValidator: EventValidator;
    teamValidator: TeamValidator;
    challengeValidator: ChallengeValidator;

    constructor(eventsService: EventsService, membersService: MembersService, eventValidator: EventValidator, teamValidator: TeamValidator, challengeValidator: ChallengeValidator) {
        this.eventsService = eventsService;
        this.membersService = membersService;
        this.eventValidator = eventValidator;
        this.teamValidator = teamValidator;
        this.challengeValidator = challengeValidator;
    }

    getEvents = async (req: Request, res: Response) => {
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

    getEventById = async (req: Request, res: Response) => {
        const { id } = req.params;

        let data = await this.eventsService.getEventById(parseInt(id));

        if (!data) {
            res.status(200).json({
                status: "error",
                message: "Event not found"
            });

            return;
        }

        res.status(200).json({
            status: "success",
            data
        });
    }

    createEvent = async (req: Request, res: Response) => {
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

    updateEvent = async (req: Request, res: Response) => {
        const { id: event_id } = req.params;
        const event: EventEntity = req.body;

        const allowedProperties = ["title", "description", "is_public", "start_at", "end_at", "is_team_based"];

        const propertyNames: string[] = Object.getOwnPropertyNames(event);
        for (let property of propertyNames) {
            if (!allowedProperties.includes(property)) {
                res.status(200).json({ status: "error", message: `Can't update ${property}` });
                return;
            }
        }

        let data = await this.eventsService.getEventById(parseInt(event_id));
        if (!data) {
            res.status(200).json({
                status: "error",
                message: "Event not found"
            });

            return;
        }

        const user = req.user;
        const hasPermissions = await this.membersService.isEventsManager(user?.id!, data.organization_id);
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const updateEvent = await this.eventsService.updateEvent(parseInt(event_id), event);
        if (!updateEvent) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Event updated successfully" });
    }

    joinEvent = async (req: Request, res: Response) => {
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
            res.status(200).json({ status: "error", message: "You already joined" });
            return;
        }

        const eventParticipation = await this.eventsService.joinEvent(parseInt(event_id), user_id);
        if (!eventParticipation) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Successfully joined the event", data: eventParticipation });
    }

    leaveEvent = async (req: Request, res: Response) => {
        const { id: event_id } = req.params;

        const user_id = req.user?.id as number;
        const leaveEvent = await this.eventsService.leaveEvent(parseInt(event_id), user_id);
        if (!leaveEvent) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "You have leaved the event successfully", data: leaveEvent });
    }

    getTeams = async (req: Request, res: Response) => {
        const { id: event_id } = req.params;
        const { page, limits } = req.query;

        let offset = 0;
        let limit = 10;

        if (page) {
            offset = parseInt(page as string) || 0;
        }

        if (limits) {
            limit = parseInt(limits as string) || limit;
        }

        let data = await this.eventsService.getTeams(parseInt(event_id), offset, limit);

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

    createTeam = async (req: Request, res: Response) => {
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

        const eventParticipant = await this.eventsService.getParticipantByUserId(parseInt(event_id), user_id);
        if (!eventParticipant) {
            res.status(200).json({ status: "error", message: "You need to join the event first" });
            return;
        }

        const teamMemeber = await this.eventsService.getTeamMemberByEventId(parseInt(event_id), user_id);
        if (teamMemeber) {
            res.status(200).json({ status: "error", message: "You are already in a team" });
            return;
        }

        const newTeam = await this.eventsService.createTeam({ ...team, leader_id: eventParticipant.id, event_id: parseInt(event_id) });
        if (!newTeam) {
            res.status(200).json({ status: "error", message: "Something went wrong while creating a team" });
            return;
        }

        await this.eventsService.joinTeam(newTeam.insertId, eventParticipant.id!);

        res.status(200).json({ status: "success", message: "Team created successfully", data: newTeam });
    }

    deleteTeam = async (req: Request, res: Response) => {
        const { team_id } = req.body;
        const { id: event_id } = req.params;

        const team = await this.eventsService.getTeamById(parseInt(team_id));
        if (!team) {
            res.status(200).json({ status: "error", message: "No Team Found" });
            return;
        }

        const user_id = req.user?.id as number;
        const eventParticipant = await this.eventsService.getParticipantByUserId(parseInt(event_id), user_id);
        if (!eventParticipant) {
            res.status(200).json({ status: "error", message: "You are not a participant in this event" });
            return;
        }

        if (team.leader_id != eventParticipant.id) {
            res.status(200).json({ status: "error", message: "Only the leader can delete the team" });
            return;
        }

        await this.eventsService.deleteTeam(parseInt(team_id));

        res.status(200).json({ status: "success", message: "Team deleted successfuly" });
    }

    joinTeam = async (req: Request, res: Response) => {
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

        res.status(200).json({ status: "success", message: "Team joined successfully", data: joinTeamResult });
    }

    leaveTeam = async (req: Request, res: Response) => {
        const { id: event_id } = req.params;

        const user_id = req.user?.id as number;

        const teamMember = await this.eventsService.getTeamMemberByEventId(parseInt(event_id), user_id);

        if (!teamMember) {
            res.status(200).json({ status: "error", message: "You are not a member of a team" });
            return;
        }

        const team = await this.eventsService.getTeamById(teamMember.team_id);
        if (team && team.leader_id == teamMember.id) {
            res.status(200).json({ status: "error", message: "You are the leader can't leave the team but you can delete it" });
            return;
        }

        const leaveTeamResult = await this.eventsService.leaveTeam(teamMember.id!);

        res.status(200).json({ status: "success", message: "Leaving successfuly", data: leaveTeamResult });
    }

    createChallenge = async (req: Request, res: Response) => {
        const { id: event_id } = req.params;
        const challenge: ChallengeEntity = req.body;

        let validate_result: ValidatorResult = this.challengeValidator.validate(challenge);
        if (!validate_result.is_valid) {
            res.status(200).json({ status: "error", message: "Invalid body parameters", errors: validate_result.messages });
            return;
        }

        const event = await this.eventsService.getEventById(parseInt(event_id));
        if (!event) {
            res.status(200).json({ status: "error", message: "Event does not exist" });
            return;
        }

        const user_id = req.user?.id as number;

        const hasPermissions = await this.membersService.isChallengesManager(user_id, event.organization_id);
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const creator_id = req.user?.id as number;
        let result = await this.eventsService.createChallenge(parseInt(event_id), { ...challenge, creator_id });
        if (!result) {
            res.status(200).json({ status: "error", message: "Can't create challenge, something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Challenge created successfully" });
    }

    getChallenges = async (req: Request, res: Response) => {
        const { id: event_id } = req.params;

        const challenges = await this.eventsService.getChallenges(parseInt(event_id));

        res.status(200).json({ status: "success", data: challenges });
    }

    updateChallenge = async (req: Request, res: Response) => {
        const { id: event_id, challenge_id } = req.params;
        const updatedChallenge: ChallengeEntity = req.body;

        const allowedProperties = [
            "title",
            "description",
            "topic",
            "level",
            "type",
        ];

        const propertyNames: string[] = Object.getOwnPropertyNames(updatedChallenge);
        for (let property of propertyNames) {
            if (!allowedProperties.includes(property)) {
                res.status(200).json({ status: "error", message: `Can't update ${property}` });
                return;
            }
        }

        const event = await this.eventsService.getEventById(parseInt(event_id));
        if (!event) {
            res.status(200).json({
                status: "error",
                message: "Event not found"
            });

            return;
        }

        const challenge = await this.eventsService.getChallengeById(parseInt(event_id), parseInt(challenge_id));
        if (!challenge) {
            res.status(200).json({
                status: "error",
                message: "Challenge not found in this event"
            });

            return;
        }

        const user = req.user;
        const hasPermissions = await this.membersService.isChallengesManager(user?.id!, event.organization_id);
        if (!hasPermissions) {
            res.status(200).json({ status: "error", message: "You don't have permissions" });
            return;
        }

        const updateEvent = await this.eventsService.updateEventChallenge(parseInt(challenge_id), updatedChallenge);
        if (!updateEvent) {
            res.status(200).json({ status: "error", message: "Something went wrong" });
            return;
        }

        res.status(200).json({ status: "success", message: "Challenge updated successfully" });
    }
};