import { MySQLDatabase } from "../MySQLDatabase";
import { JOBPOST_CREATE_PROPS, JOBPOST_SELECT_PROPS, JobPostsRepositoryInterface } from "@/domain/repositories/JobPostsRepositoryInterface";
import { ORGANIZATION_JOIN_PROPS } from "@/domain/repositories/OrganizationsRepositoryInterface";

export default class JobPostsRepository implements JobPostsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createJobPost(job_post: JobPostEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into job_posts (${JOBPOST_CREATE_PROPS}) values (?);`, [
            job_post.title,
            job_post.description,
            job_post.role,
            job_post.type,
            job_post.location,
            job_post.contractType,
            job_post.organization_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getJobPostById(id: number): Promise<JobPostEntity | null> {
        let data = await this.database.query<JobPostEntity[]>(`select ${JOBPOST_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from job_posts join organizations on organization_id = organizations.id where job_posts.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getJobPostsByPage(page: number = 0, limits: number = 10): Promise<JobPostEntity[] | null> {
        let data = await this.database.query<JobPostEntity[]>(`select ${JOBPOST_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from job_posts join organizations on organization_id = organizations.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }

    async updateJobPostById(job_post_id: number, jobPost: JobPostEntity): Promise<InsertResultInterface | null> {
        let query = '';

        const params = [];
        const propertyNames = Object.getOwnPropertyNames(jobPost);
        for (let i = 0; i < propertyNames.length; i++) {
            let property = propertyNames[i];
            query += `${property} = ?`;
            params.push((jobPost as any)[property]);
            if (i < (propertyNames.length - 1)) {
                query += ',';
            }
        }

        let updateJobPost = await this.database.query<InsertResultInterface>(`update job_posts set ${query} where id = ?;`, ...params, job_post_id);
        if (!updateJobPost) {
            return null;
        }

        return updateJobPost;
    }

    async deleteJobPost(job_post_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from job_posts where id = ?;`, [job_post_id]);

        if (result) {
            return result;
        }

        return null;
    }

    async getOrganizationJobPosts(organization_id: number): Promise<JobPostEntity[] | null> {
        let data = await this.database.query<JobPostEntity[]>(`select ${JOBPOST_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from job_posts join organizations on organization_id = organizations.id where organization_id = ?;`, [organization_id]);
        if (!data) {
            return null;
        }

        return data;
    }

    async searchJobPosts(query: string): Promise<JobPostEntity[] | null> {
        const searchQuery = `%${query}%`;
        let data = await this.database.query<JobPostEntity[]>(`select ${JOBPOST_SELECT_PROPS}, JSON_OBJECT(${ORGANIZATION_JOIN_PROPS}) AS organization from job_posts join organizations on organization_id = organizations.id where job_posts.title like ? or job_posts.description like ? or job_posts.role like ? or organizations.name like ?;`, searchQuery, searchQuery, searchQuery, searchQuery);
        if (!data) {
            return null;
        }

        return data;
    }
}