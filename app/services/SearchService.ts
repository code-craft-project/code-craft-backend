import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import EventsRepository from "@/infrastructure/database/repositories/EventsRepository";
import JobPostsRepository from "@/infrastructure/database/repositories/JobPostsRepository";
import OrganizationsRepository from "@/infrastructure/database/repositories/OrganizationsRepository";

export default class SearchService {
    jobPostsRepository: JobPostsRepository;
    eventsRepository: EventsRepository;
    challengesRepository: ChallengesRepository;
    organizationsRepository: OrganizationsRepository;

    constructor(
        jobPostsRepository: JobPostsRepository,
        eventsRepository: EventsRepository,
        challengesRepository: ChallengesRepository,
        organizationsRepository: OrganizationsRepository
    ) {
        this.jobPostsRepository = jobPostsRepository;
        this.eventsRepository = eventsRepository;
        this.challengesRepository = challengesRepository;
        this.organizationsRepository = organizationsRepository;
    }

    async searchJobPosts(query: string): Promise<JobPostEntity[]> {
        return await this.jobPostsRepository.searchJobPosts(query) || [];
    }

    async searchEvents(query: string): Promise<EventEntity[]> {
        return await this.eventsRepository.searchEvents(query) || [];
    }

    async searchChallenges(query: string, user_id: number = 0): Promise<ChallengeEntity[]> {
        return await this.challengesRepository.searchChallenges(query) || [];
    }

    async searchOrganizations(query: string): Promise<OrganizationEntity[]> {
        return await this.organizationsRepository.searchOrganizations(query) || [];
    }
};