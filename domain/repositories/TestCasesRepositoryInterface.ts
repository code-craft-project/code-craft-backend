export const TEST_CASE_CREATE_PROPS: string = 'challenge_id, output';
export const TEST_CASE_SELECT_PROPS: string = 'test_cases.id as id, test_cases.output as output, test_cases.challenge_id as challenge_id, test_cases.created_at as created_at';

export interface TestCasesRepositoryInterface {
    createTestCase(testCase: TestCaseEntity): Promise<InsertResultInterface | null>;
    getTestCaseById(id: number): Promise<TestCaseEntity | null>;
    getTestCasesByChallengeId(challengeId: number): Promise<TestCaseEntity[] | null>;
    removeByChallengeId(challengeId: number): Promise<InsertResultInterface | null>;
    updateTestCase(testCaseId: number, output: string): Promise<InsertResultInterface | null>;
    removeById(testCaseId: number): Promise<InsertResultInterface | null>;
};