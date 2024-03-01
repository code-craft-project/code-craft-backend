import { MySQLDatabase } from "../MySQLDatabase";
import { JOBPOST_CREATE_PROPS, JOBPOST_SELECT_PROPS, JobPostsRepositoryInterface } from "@/domain/repositories/JobPostsRepositoryInterface";
import { COMPANY_JOIN_PROPS } from "@/domain/repositories/CompaniesRepositoryInterface";

export default class JobPostsRepository implements JobPostsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }
    
    async createJobPost(job_post: JobPostInterface): Promise<JobPostInterface | null> {
        let result = await this.database.query<JobPostInterface>(`insert into job_posts (${JOBPOST_CREATE_PROPS}) values (?);`, [
            job_post.title,
            job_post.description,
            job_post.role,
            job_post.type,
            job_post.company_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getJobPostById(id: number): Promise<JobPostInterface | null> {
        let data = await this.database.query<JobPostInterface[]>(`select ${JOBPOST_SELECT_PROPS}, JSON_OBJECT(${COMPANY_JOIN_PROPS}) AS company from job_posts join companies on company_id = companies.id where job_posts.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getJobPostsByPage(page: number = 0, limits: number = 10): Promise<JobPostInterface[] | null> {
        let data = await this.database.query<JobPostInterface[]>(`select ${JOBPOST_SELECT_PROPS}, JSON_OBJECT(${COMPANY_JOIN_PROPS}) AS company from job_posts join companies on company_id = companies.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }
}