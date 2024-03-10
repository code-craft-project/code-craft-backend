import JobPostsRepository from "@/infrastructure/database/repositories/JobPostsRepository";

export default class JobPostsService {
    jobPostsRepository: JobPostsRepository;

    constructor(jobPostsRepository: JobPostsRepository) {
        this.jobPostsRepository = jobPostsRepository;
    }

    async createJobPost(jobPost: JobPostEntity): Promise<InsertResultInterface | null> {
        return await this.jobPostsRepository.createJobPost(jobPost);
    }

    async getJobPostById(id: number): Promise<JobPostEntity | null> {
        return await this.jobPostsRepository.getJobPostById(id);
    }

    async getJobPostsByPage(page?: number, limits?: number): Promise<JobPostEntity[] | null> {
        return await this.jobPostsRepository.getJobPostsByPage(page, limits);
    }
};