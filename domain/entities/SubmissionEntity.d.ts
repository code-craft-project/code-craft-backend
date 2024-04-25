type SubmissionStatus = 'correct' | 'wrong';

interface SubmissionEntity {
    id?: number;
    challenge_id: number;
    user_id: number;
    status: SubmissionStatus;
    content: string;
    created_at?: string;
};