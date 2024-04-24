interface TestCaseEntity {
    id?: number;
    challenge_id?: number;
    output: string;
    created_at?: string;
    updated_at?: string;
    inputs?: TestCaseInputEntity[];
};