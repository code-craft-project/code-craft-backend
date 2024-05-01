type TestCaseInputType = 'number' | 'string' | 'boolean' | 'array_of_numbers' | 'array_of_strings' | 'array_of_booleans';

interface TestCaseInputEntity {
    id?: number;
    test_case_id?: number;
    input: string;
    type: TestCaseInputType;
    index: number;
    created_at?: string;
    updated_at?: string;
};