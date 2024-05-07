export const TEST_CASE_INPUT_CREATE_PROPS: string = 'test_case_id, input, type, _index';
export const TEST_CASE_INPUT_JOIN_PROPS: string = "'id', test_case_inputs.id, 'input', test_case_inputs.input, 'type', test_case_inputs.type, 'index', test_case_inputs._index";
export const TEST_CASE_INPUT_SELECT_PROPS: string = 'test_case_inputs.id as id, test_case_id, input, type, _index, test_cases.created_at as created_at';

export interface TestCaseInputsRepositoryInterface {
    createTestCaseInput(testCaseInput: TestCaseInputEntity): Promise<InsertResultInterface | null>;
    getTestCasesByTestCaseId(testCaseId: number): Promise<TestCaseInputEntity[] | null>;
    removeByTestCaseId(testCaseId: number): Promise<InsertResultInterface | null>;
    updateTestCaseInput(testCaseInputId: number, testCaseInput: TestCaseInputEntity): Promise<InsertResultInterface | null>;
};