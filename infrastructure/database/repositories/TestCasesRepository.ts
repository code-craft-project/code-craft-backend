import { TEST_CASE_CREATE_PROPS, TEST_CASE_SELECT_PROPS, TestCasesRepositoryInterface } from "@/domain/repositories/TestCasesRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";
import { TEST_CASE_INPUT_JOIN_PROPS } from "@/domain/repositories/TestCaseInputsRepositoryInterface";

export default class TestCasesRepository implements TestCasesRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createTestCase(testCase: TestCaseEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into test_cases (${TEST_CASE_CREATE_PROPS}) values (?);`, [
            testCase.challenge_id,
            testCase.output,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getTestCaseById(id: number): Promise<TestCaseEntity | null> {
        const data = await this.database.query<TestCaseEntity[]>(`select ${TEST_CASE_SELECT_PROPS}, JSON_ARRAYAGG(JSON_OBJECT(${TEST_CASE_INPUT_JOIN_PROPS})) AS inputs from test_cases left join test_case_inputs on test_cases.id = test_case_inputs.test_case_id where test_cases.id = ? group by test_cases.id, test_cases.output, test_cases.challenge_id, test_cases.created_at;`, [id]);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    async getTestCasesByChallengeId(challengeId: number): Promise<TestCaseEntity[] | null> {
        let data = await this.database.query<TestCaseEntity[]>(`select ${TEST_CASE_SELECT_PROPS}, JSON_ARRAYAGG(JSON_OBJECT(${TEST_CASE_INPUT_JOIN_PROPS})) AS inputs from test_cases left join test_case_inputs on test_cases.id = test_case_inputs.test_case_id where test_cases.challenge_id = ? group by test_cases.id, test_cases.output, test_cases.challenge_id, test_cases.created_at;`, [challengeId]);

        if (data) {
            return data;
        }

        return null;
    }

    async removeByChallengeId(challengeId: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from test_cases where challenge_id = ?;`, challengeId);

        if (result) {
            return result;
        }

        return null;
    }

    async updateTestCase(testCaseId: number, output: string): Promise<InsertResultInterface | null> {
        let updateTestCaseResult = await this.database.query<InsertResultInterface>(`update test_cases set output = ? where id = ?;`, output, testCaseId);
        if (!updateTestCaseResult) {
            return null;
        }

        return updateTestCaseResult;
    }

    async removeById(testCaseId: number): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from test_cases where id = ?;`, testCaseId);

        if (result) {
            return result;
        }

        return null;
    }
}