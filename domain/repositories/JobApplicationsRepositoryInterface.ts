export const JOB_APPLICATION_CREATE_PROPS: string = 'job_post_id, user_id, cover_message, resume_url';
export const JOB_APPLICATION_SELECT_PROPS: string = 'job_applications.id as id, job_post_id, job_applications.user_id as user_id, cover_message, resume_url, job_applications.created_at as created_at';

export interface JobApplicationsRepositoryInterface {
    createJobApplication(jobApplication: JobApplicationEntity): Promise<InsertResultInterface | null>;
    getJobApplicationById(id: number): Promise<JobApplicationEntity | null>;
    getUserJobApplicationById(id: number, user_id: number): Promise<JobApplicationEntity | null>;
    getJobApplicationsByPage(page: number, limits: number): Promise<JobApplicationEntity[] | null>;
    getJobPostApplications(job_post_id: number): Promise<JobApplicationEntity[] | null>;
    deleteJobPostApplications(job_post_id: number): Promise<InsertResultInterface | null>;
};