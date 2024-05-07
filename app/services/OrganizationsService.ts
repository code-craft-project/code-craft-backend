import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import EventsRepository from "@/infrastructure/database/repositories/EventsRepository";
import JobApplicationsRepository from "@/infrastructure/database/repositories/JobApplicationsRepository";
import JobPostsRepository from "@/infrastructure/database/repositories/JobPostsRepository";
import MembersRepository from "@/infrastructure/database/repositories/MembersRepository";
import OrganizationChallengesRepository from "@/infrastructure/database/repositories/OrganizationChallengesRepository";
import OrganizationsRepository from "@/infrastructure/database/repositories/OrganizationsRepository";
import TestCasesRepository from "@/infrastructure/database/repositories/TestCasesRepository";
import TestCaseInputsRepository from "@/infrastructure/database/repositories/TestCaseInputsRepository";

export default class OrganizationsService {
    organizationsRepository: OrganizationsRepository;
    jobPostsRepository: JobPostsRepository;
    jobApplicationsRepository: JobApplicationsRepository;
    eventsRepository: EventsRepository;
    challengesRepository: ChallengesRepository;
    organizationChallengesRepository: OrganizationChallengesRepository;
    membersRepository: MembersRepository;
    testCasesRepository: TestCasesRepository;
    testCaseInputsRepository: TestCaseInputsRepository;

    constructor(organizationsRepository: OrganizationsRepository, jobPostsRepository: JobPostsRepository, jobApplicationsRepository: JobApplicationsRepository, eventsRepository: EventsRepository, challengesRepository: ChallengesRepository, organizationChallengesRepository: OrganizationChallengesRepository, membersRepository: MembersRepository, testCasesRepository: TestCasesRepository, testCaseInputsRepository: TestCaseInputsRepository) {
        this.organizationsRepository = organizationsRepository;
        this.jobPostsRepository = jobPostsRepository;
        this.jobApplicationsRepository = jobApplicationsRepository;
        this.eventsRepository = eventsRepository;
        this.challengesRepository = challengesRepository;
        this.organizationChallengesRepository = organizationChallengesRepository;
        this.membersRepository = membersRepository;
        this.testCasesRepository = testCasesRepository;
        this.testCaseInputsRepository = testCaseInputsRepository;
    }

    async createOrganization(organization: OrganizationEntity): Promise<OrganizationEntity | null> {
        const insertResult = await this.organizationsRepository.createOrganization(organization);
        if (insertResult) {
            return await this.organizationsRepository.getOrganizationById(insertResult.insertId);
        }
        return null;
    }

    async updateOrganization(organization_id: number, organization: OrganizationEntity): Promise<InsertResultInterface | null> {
        return await this.organizationsRepository.updateOrganizationById(organization_id, organization);
    }

    async getOrganizationById(id: number): Promise<OrganizationEntity | null> {
        return await this.organizationsRepository.getOrganizationById(id);
    }

    async getOrganizationByName(name: string): Promise<OrganizationEntity | null> {
        return await this.organizationsRepository.getOrganizationByName(name);
    }

    async getOrganizationsByPage(page?: number, limits?: number): Promise<OrganizationEntity[] | null> {
        return await this.organizationsRepository.getOrganizationsByPage(page, limits);
    }

    async getOrganizationsByUserId(user_id: number): Promise<OrganizationEntity[] | null> {
        return await this.organizationsRepository.getOrganizationsByUserId(user_id);
    }


    async getOrganizationJobPosts(organization_id: number): Promise<JobPostEntity[] | null> {
        return await this.jobPostsRepository.getOrganizationJobPosts(organization_id);
    }

    async getJobPostApplications(job_post_id: number): Promise<JobApplicationEntity[] | null> {
        return await this.jobApplicationsRepository.getJobPostApplications(job_post_id);
    }

    async getEvents(organization_id: number, page: number, limits: number): Promise<EventEntity[] | null> {
        return await this.eventsRepository.getOrganizationEventsByPage(organization_id, page, limits);
    }

    async getChallenges(organization_id: number): Promise<ChallengeEntity[] | null> {
        return await this.challengesRepository.getChallengesByOrganizationId(organization_id);
    }

    async createChallenge(organization_id: number, challenge: ChallengeEntity): Promise<ChallengeEntity | null> {
        const createChallenge = await this.challengesRepository.createChallenge(challenge);
        if (!createChallenge) {
            return null;
        }

        await this.organizationChallengesRepository.createOrganizationChallenge({ organization_id, challenge_id: createChallenge.insertId });
        return await this.challengesRepository.getChallengeById(createChallenge.insertId);
    }

    async getChallengeById(organization_id: number, challenge_id: number): Promise<ChallengeEntity | null> {
        return await this.challengesRepository.getOrganizationChallengeById(organization_id, challenge_id);
    }

    async deleteOrganizationChallenge(organization_id: number, challenge_id: number): Promise<InsertResultInterface | null> {
        const deleteOrganizationChallenge = await this.organizationChallengesRepository.removeOrganizationChallenge({ challenge_id, organization_id });
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

    async getOrganizationDashboard(organization_id: number): Promise<OrganizationDashboardStats> {
        const latestChallenges = await this.challengesRepository.getOrganizationLatestChallenges(organization_id);
        const latestEvents = await this.eventsRepository.getOrganizationLatestEvents(organization_id);
        const latestMembers = await this.membersRepository.getOrganizationLatestMembers(organization_id);

        const dashboardStat = await this.organizationsRepository.getDashboardStat(organization_id);

        let organizationStats: OrganizationStats = {
            total_challenges: 0,
            total_events: 0,
            total_members: 0,
            total_participants: 0
        };

        if (dashboardStat) {
            organizationStats = { ...dashboardStat };
        }

        return {
            latest_challenges: latestChallenges || [],
            latest_events: latestEvents || [],
            latest_members: latestMembers || [],
            total_challenges: organizationStats.total_challenges,
            total_events: organizationStats.total_events,
            total_members: organizationStats.total_members,
            total_participants: organizationStats.total_participants
        };
    }
};