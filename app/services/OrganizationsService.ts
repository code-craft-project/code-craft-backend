import JobApplicationsRepository from "@/infrastructure/database/repositories/JobApplicationsRepository";
import JobPostsRepository from "@/infrastructure/database/repositories/JobPostsRepository";
import OrganizationsRepository from "@/infrastructure/database/repositories/OrganizationsRepository";

export default class OrganizationsService {
    organizationsRepository: OrganizationsRepository;
    jobPostsRepository: JobPostsRepository;
    jobApplicationsRepository: JobApplicationsRepository;

    constructor(organizationsRepository: OrganizationsRepository, jobPostsRepository: JobPostsRepository, jobApplicationsRepository: JobApplicationsRepository) {
        this.organizationsRepository = organizationsRepository;
        this.jobPostsRepository = jobPostsRepository;
        this.jobApplicationsRepository = jobApplicationsRepository;
    }

    async createOrganization(organization: OrganizationEntity): Promise<InsertResultInterface | null> {
        return await this.organizationsRepository.createOrganization(organization);
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

    async getOrganizationJobPosts(organization_id: number): Promise<JobPostEntity[] | null> {
        return await this.jobPostsRepository.getOrganizationJobPosts(organization_id);
    }

    async getJobPostApplications(job_post_id: number): Promise<JobApplicationEntity[] | null> {
        return await this.jobApplicationsRepository.getJobPostApplications(job_post_id);
    }
};