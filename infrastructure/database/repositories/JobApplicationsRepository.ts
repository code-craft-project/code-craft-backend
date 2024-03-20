import { JOB_APPLICATION_CREATE_PROPS, JOB_APPLICATION_SELECT_PROPS, JobApplicationsRepositoryInterface } from "@/domain/repositories/JobApplicationsRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { USER_JOIN_PROPS } from "@/domain/repositories/UsersRepositoryInterface";

export default class JobApplicationsRepository implements JobApplicationsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createJobApplication(job_application: JobApplicationEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into job_applications (${JOB_APPLICATION_CREATE_PROPS}) values (?);`, [
            job_application.job_post_id,
            job_application.user_id,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getJobApplicationById(id: number): Promise<JobApplicationEntity | null> {
        let data = await this.database.query<JobApplicationEntity[]>(`select ${JOB_APPLICATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from job_applications join users on job_applications.user_id = users.id where job_applications.id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getUserJobApplicationById(id: number, user_id: number): Promise<JobApplicationEntity | null> {
        let data = await this.database.query<JobApplicationEntity[]>(`select ${JOB_APPLICATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from job_applications join users on job_applications.user_id = users.id where job_applications.id = ? and job_applications.user_id = ?;`, id, user_id);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getJobApplicationsByPage(page: number = 0, limits: number = 10): Promise<JobApplicationEntity[] | null> {
        let data = await this.database.query<JobApplicationEntity[]>(`select ${JOB_APPLICATION_SELECT_PROPS}, JSON_OBJECT(${USER_JOIN_PROPS}) AS user from job_applications join users on job_applications.user_id = users.id limit ?;`, [page, limits]);
        if (!data) {
            return null;
        }

        return data;
    }


    async deleteJobPostApplications(job_post_id: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from job_applications where job_post_id = ?;`, [job_post_id]);

        if (result) {
            return result;
        }

        return null;
    }
}