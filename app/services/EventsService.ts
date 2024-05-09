import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import EventChallengesRepository from "@/infrastructure/database/repositories/EventChallengesRepository";
import EventParticipantsRepository from "@/infrastructure/database/repositories/EventParticipantsRepository";
import EventsRepository from "@/infrastructure/database/repositories/EventsRepository";
import TeamMembersRepository from "@/infrastructure/database/repositories/TeamMembersRepository";
import TeamsRepository from "@/infrastructure/database/repositories/TeamsRepository";
import TestCaseInputsRepository from "@/infrastructure/database/repositories/TestCaseInputsRepository";
import TestCasesRepository from "@/infrastructure/database/repositories/TestCasesRepository";

export default class EventsService {
    eventsRepository: EventsRepository;
    eventParticipantsRepository: EventParticipantsRepository;
    teamsRepository: TeamsRepository;
    teamMembersRepository: TeamMembersRepository;
    challengesRepository: ChallengesRepository;
    eventChallengesRepository: EventChallengesRepository;
    testCasesRepository: TestCasesRepository;
    testCaseInputsRepository: TestCaseInputsRepository;

    constructor(eventsRepository: EventsRepository, eventParticipantsRepository: EventParticipantsRepository, teamsRepository: TeamsRepository, teamMembersRepository: TeamMembersRepository, challengesRepository: ChallengesRepository, eventChallengesRepository: EventChallengesRepository, testCasesRepository: TestCasesRepository, testCaseInputsRepository: TestCaseInputsRepository) {
        this.eventsRepository = eventsRepository;
        this.eventParticipantsRepository = eventParticipantsRepository;
        this.teamsRepository = teamsRepository;
        this.teamMembersRepository = teamMembersRepository;
        this.challengesRepository = challengesRepository;
        this.eventChallengesRepository = eventChallengesRepository;
        this.testCasesRepository = testCasesRepository;
        this.testCaseInputsRepository = testCaseInputsRepository;
    }

    async createEvent(event: EventEntity): Promise<EventEntity | null> {
        const insertResult = await this.eventsRepository.createEvent(event);
        if (insertResult) {
            return await this.eventsRepository.getEventById(insertResult.insertId);
        }

        return null;
    }

    async getEventById(id: number, user_id: number = 0): Promise<EventEntity | null> {
        return await this.eventsRepository.getEventById(id, user_id);
    }

    async getChallengeById(event_id: number, challenge_id: number): Promise<ChallengeEntity | null> {
        return await this.challengesRepository.getEventChallengeById(event_id, challenge_id);
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

    async getTeams(event_id: number, page?: number, limits?: number): Promise<TeamEntity[] | null> {
        return await this.teamsRepository.getTeamsByPage(event_id, page, limits);
    }

    async createTeam(team: TeamEntity): Promise<TeamEntity | null> {
        const insertResult = await this.teamsRepository.createTeam(team);
        if (insertResult) {
            return await this.teamsRepository.getTeamById(insertResult.insertId);
        }
        return null;
    }

    async updateTeam(id: number, team: TeamEntity): Promise<InsertResultInterface | null> {
        return await this.teamsRepository.updateTeam(id, team);
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

    async joinTeam(team_id: number, event_participant_id: number): Promise<TeamEntity | null> {
        const insertResult = await this.teamMembersRepository.createTeamMember({ team_id, event_participant_id });
        if (insertResult) {
            return await this.getTeamById(insertResult.insertId);
        }
        return null;
    }

    async leaveTeam(team_member_id: number): Promise<InsertResultInterface | null> {
        return await this.teamMembersRepository.removeTeamMemberById(team_member_id);
    }

    async updateEvent(event_id: number, event: EventEntity): Promise<InsertResultInterface | null> {
        return await this.eventsRepository.updateEvent(event_id, event);
    }

    async createChallenge(event_id: number, challenge: ChallengeEntity): Promise<ChallengeEntity | null> {
        const createChallenge = await this.challengesRepository.createChallenge(challenge);
        if (!createChallenge) {
            return null;
        }

        await this.eventChallengesRepository.createEventChallenge({ event_id, challenge_id: createChallenge.insertId });
        return await this.challengesRepository.getChallengeById(createChallenge.insertId);
    }

    async getChallenges(event_id: number): Promise<ChallengeEntity[] | null> {
        return await this.challengesRepository.getChallengesByEventId(event_id);
    }

    async getChallengesByTopic(event_id: number, challengeTopic: ChallengeTopic): Promise<ChallengeEntity[] | null> {
        return await this.challengesRepository.getEventChallengesByTopic(event_id, challengeTopic);
    }

    async updateEventChallenge(challenge_id: number, challenge: ChallengeEntity): Promise<InsertResultInterface | null> {
        return await this.challengesRepository.updateChallenge(challenge_id, challenge);
    }

    async getUserTeam(user_id: number, event_id: number): Promise<TeamEntity | null> {
        return await this.teamsRepository.getUserTeamByEventId(user_id, event_id);
    }

    async deleteEventChallenge(event_id: number, challenge_id: number): Promise<InsertResultInterface | null> {
        const deleteOrganizationChallenge = await this.eventChallengesRepository.removeEventChallenge({ challenge_id, event_id });
        if (!deleteOrganizationChallenge) {
            return null;
        }

        const testCases = await this.testCasesRepository.getTestCasesByChallengeId(challenge_id);
        testCases?.forEach(async (t) => {
            await this.testCaseInputsRepository.removeByTestCaseId(t.id!);
        });

        await this.testCasesRepository.removeByChallengeId(challenge_id);

        return await this.challengesRepository.removeChallengeById(challenge_id);
    }

    async deleteEvent(event_id: number): Promise<InsertResultInterface | null> {
        // Delete Event participants
        await this.eventParticipantsRepository.removeEventParticipantsByEventId(event_id);

        // Delete Event Challenges
        const challenges = await this.challengesRepository.getChallengesByEventId(event_id);
        if (challenges) {
            for (let i = 0; i < challenges.length; i++) {
                const challenge: ChallengeEntity = challenges[i];
                await this.eventChallengesRepository.removeEventChallenge({ challenge_id: challenge.id!, event_id: event_id });
                await this.challengesRepository.removeChallengeById(challenge.id!);
            }
        }
        // Delete Event Teams
        const teams = await this.teamsRepository.getTeamsByEventId(event_id);
        if (teams) {
            for (let i = 0; i < teams.length; i++) {
                const team = teams[i];
                await this.teamMembersRepository.removeMembersByTeamId(team.id!);
                await this.teamsRepository.removeTeamById(team.id!);
            }
        }

        // TODO: Remove From Permissions table

        return await this.eventsRepository.deleteEventById(event_id);
    }
};