import { MySQLDatabase } from "../MySQLDatabase";
import { TEST_CASE_INPUT_CREATE_PROPS, TEST_CASE_INPUT_SELECT_PROPS, TestCaseInputsRepositoryInterface } from "@/domain/repositories/TestCaseInputsRepositoryInterface";

export default class TestCaseInputsRepository implements TestCaseInputsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createTestCaseInput(testCaseInput: TestCaseInputEntity): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`insert into test_case_inputs (${TEST_CASE_INPUT_CREATE_PROPS}) values (?);`, [
            testCaseInput.test_case_id,
            testCaseInput.input,
            testCaseInput.type,
            testCaseInput.index,
        ]);

        if (result) {
            return result;
        }

        return null;
    }

    async getTestCasesByTestCaseId(testCaseId: number): Promise<TestCaseInputEntity[] | null> {
        let data = await this.database.query<TestCaseInputEntity[]>(`select ${TEST_CASE_INPUT_SELECT_PROPS} from test_case_inputs where test_case_id = ?;`, [testCaseId]);

        if (data) {
            return data;
        }

        return null;
    }
}