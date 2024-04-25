import { SUBMISSION_CREATE_PROPS, SUBMISSION_SELECT_PROPS, SubmissionsRepositoryInterface } from "@/domain/repositories/SubmissionsRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";

export default class SubmissionsRepository implements SubmissionsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createSubmission(submission: SubmissionEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into submissions (${SUBMISSION_CREATE_PROPS}) values (?);`, [
            submission.challenge_id,
            submission.user_id,
            submission.status,
            submission.content
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getSubmissionById(id: number): Promise<SubmissionEntity | null> {
        const data = await this.database.query<SubmissionEntity[]>(`select ${SUBMISSION_SELECT_PROPS} from submissions where id = ?;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getUserSubmissionsByChallengeId(user_id: number, challengeId: number): Promise<SubmissionEntity[] | null> {
        let data = await this.database.query<SubmissionEntity[]>(`select ${SUBMISSION_SELECT_PROPS} from submissions where user_id = ? and challenge_id = ?;`, user_id, challengeId);

        if (data) {
            return data;
        }

        return null;
    }
}