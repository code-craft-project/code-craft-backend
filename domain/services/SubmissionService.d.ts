type SubmissionType = 'run' | 'submit';

interface SubmissionRequest {
    operation: SubmissionType;
    challengeId: number;
    payload: ExecutionRequest;
};

interface SubmissionResult {
    operation: SubmissionType;
    challengeId: number;
    payload: any;
};

interface SubmissionTask {
    clientId: string;
    executionResult: ExecutionResult;
    executionPayload: ExecutionPayload;
};


interface RunOperationResult {
    testCase: TestCaseEntity;
    executionResult: ExecutionResult;
};

interface SubmitOperationResult {
    submission: SubmissionEntity;
    testCase?: TestCaseEntity;
    executionResult: ExecutionResult;
};

