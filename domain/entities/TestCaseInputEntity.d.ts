type TestCaseInputType = 'number' | 'array' | 'string';

interface TestCaseInputEntity {
    id?: number;
    test_case_id?: number;
    input: string;
    type: TestCaseInputType;
    index: number;
    created_at?: string;
    updated_at?: string;
};