export const JOBPOST_CREATE_PROPS: string = 'title, description, role, type, organization_id';
export const JOBPOST_SELECT_PROPS: string = 'job_posts.id as id, title, description, role, type, organization_id, job_posts.created_at as created_at, job_posts.updated_at as updated_at';

export interface JobPostsRepositoryInterface {
    createJobPost(JobPost: JobPostEntity): Promise<InsertResultInterface | null>;
    getJobPostById(id: number): Promise<JobPostEntity | null>;
    getJobPostsByPage(page: number, limits: number): Promise<JobPostEntity[] | null>;
};