import EventParticipantsRepository from "@/infrastructure/database/repositories/EventParticipantsRepository";
import EventsRepository from "@/infrastructure/database/repositories/EventsRepository";
import TeamMembersRepository from "@/infrastructure/database/repositories/TeamMembersRepository";
import TeamsRepository from "@/infrastructure/database/repositories/TeamsRepository";

export default class EventsService {
    eventsRepository: EventsRepository;
    eventParticipantsRepository: EventParticipantsRepository;
    teamsRepository: TeamsRepository;
    teamMembersRepository: TeamMembersRepository;

    constructor(eventsRepository: EventsRepository, eventParticipantsRepository: EventParticipantsRepository, teamsRepository: TeamsRepository, teamMembersRepository: TeamMembersRepository) {
        this.eventsRepository = eventsRepository;
        this.eventParticipantsRepository = eventParticipantsRepository;
        this.teamsRepository = teamsRepository;
        this.teamMembersRepository = teamMembersRepository;
    }

    async createEvent(event: EventEntity): Promise<InsertResultInterface | null> {
        return await this.eventsRepository.createEvent(event);
    }

    async getEventById(id: number): Promise<EventEntity | null> {
        return await this.eventsRepository.getEventById(id);
    }

    async getEventsByPage(page?: number, limits?: number): Promise<EventEntity[] | null> {
        return await this.eventsRepository.getEventsByPage(page, limits);
    }

    async joinEvent(event_id: number, user_id: number): Promise<InsertResultInterface | null> {
        return await this.eventParticipantsRepository.createEventParticipant({ event_id, user_id });
    }

    async leaveEvent(event_id: number, user_id: number): Promise<EventParticipantEntity | null> {
        return await this.eventParticipantsRepository.removeEventParticipant({ event_id, user_id });
    }

    async didUserJoin(event_id: number, user_id: number): Promise<boolean> {
        const eventParticipant = await this.eventParticipantsRepository.getEventParticipantByUserId(user_id, event_id);
        if (eventParticipant) {
            return true;
        }

        return false;
    }

    async createTeam(team: TeamEntity): Promise<InsertResultInterface | null> {
        return await this.teamsRepository.createTeam(team);
    }

    async deleteTeam(team_id: number): Promise<InsertResultInterface | null> {
        await this.teamMembersRepository.removeMembersByTeamId(team_id);
        return await this.teamsRepository.removeTeamById(team_id);
    }

    async getTeamById(team_id: number) {
        return await this.teamsRepository.getTeamById(team_id);
    }

    async getTeamMemberByEventId(event_id: number, user_id: number): Promise<TeamMemberEntity | null> {
        return await this.teamMembersRepository.getTeamMemberByEventId(event_id, user_id);
    }

    async getParticipantByUserId(event_id: number, user_id: number): Promise<EventParticipantEntity | null> {
        return await this.eventParticipantsRepository.getEventParticipantByUserId(user_id, event_id);
    }

    async joinTeam(team_id: number, event_participant_id: number): Promise<InsertResultInterface | null> {
        return await this.teamMembersRepository.createTeamMember({ team_id, event_participant_id });
    }

    async leaveTeam(team_member_id: number): Promise<InsertResultInterface | null> {
        return await this.teamMembersRepository.removeTeamMemberById(team_member_id);
    }
};