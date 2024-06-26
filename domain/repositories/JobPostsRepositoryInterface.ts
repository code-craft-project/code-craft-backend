export const JOBPOST_CREATE_PROPS: string = 'title, description, role, type, location, contractType, organization_id';
export const JOBPOST_SELECT_PROPS: string = 'job_posts.id as id, title, job_posts.description as description, role, job_posts.type as type, location, contractType, organization_id, job_posts.created_at as created_at, job_posts.updated_at as updated_at';

export interface JobPostsRepositoryInterface {
    createJobPost(jobPost: JobPostEntity): Promise<InsertResultInterface | null>;
    getJobPostById(id: number): Promise<JobPostEntity | null>;
    getOrganizationJobPosts(organization_id: number): Promise<JobPostEntity[] | null>;
    getJobPostsByPage(page: number, limits: number): Promise<JobPostEntity[] | null>;
    updateJobPostById(job_post_id: number, jobPost: JobPostEntity): Promise<InsertResultInterface | null>;
    deleteJobPost(job_post_id: number): Promise<InsertResultInterface | null>;
    searchJobPosts(query: string): Promise<JobPostEntity[] | null>;
};