import JobApplicationsRepository from "@/infrastructure/database/repositories/JobApplicationsRepository";
import JobPostsRepository from "@/infrastructure/database/repositories/JobPostsRepository";

export default class JobPostsService {
    jobPostsRepository: JobPostsRepository;
    jobApplicationsRepository: JobApplicationsRepository;

    constructor(jobPostsRepository: JobPostsRepository, jobApplicationsRepository: JobApplicationsRepository) {
        this.jobPostsRepository = jobPostsRepository;
        this.jobApplicationsRepository = jobApplicationsRepository;
    }

    async createJobPost(jobPost: JobPostEntity): Promise<JobPostEntity | null> {
        const insertResult = await this.jobPostsRepository.createJobPost(jobPost);
        if (insertResult) {
            return await this.jobPostsRepository.getJobPostById(insertResult.insertId);
        }
        return null;
    }

    async getJobPostById(id: number): Promise<JobPostEntity | null> {
        return await this.jobPostsRepository.getJobPostById(id);
    }

    async getJobPostsByPage(page?: number, limits?: number): Promise<JobPostEntity[] | null> {
        return await this.jobPostsRepository.getJobPostsByPage(page, limits);
    }

    async updateJobPost(job_post_id: number, jobPost: JobPostEntity): Promise<InsertResultInterface | null> {
        return await this.jobPostsRepository.updateJobPostById(job_post_id, jobPost);
    }

    async deleteJobPost(job_post_id: number): Promise<InsertResultInterface | null> {
        await this.jobApplicationsRepository.deleteJobPostApplications(job_post_id);
        return await this.jobPostsRepository.deleteJobPost(job_post_id);
    }

    async getUserJobApplicationById(user_id: number, job_post_id: number): Promise<JobApplicationEntity | null> {
        return await this.jobApplicationsRepository.getUserJobApplicationById(job_post_id, user_id);
    }

    async applyToJob(user_id: number, job_post_id: number): Promise<JobApplicationEntity | null> {
        const insertResult = await this.jobApplicationsRepository.createJobApplication({ user_id, job_post_id });
        if (insertResult) {
            return await this.jobApplicationsRepository.getJobApplicationById(insertResult.insertId);
        }
        return null;
    }
};