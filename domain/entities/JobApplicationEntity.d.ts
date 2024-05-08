interface JobApplicationEntity {
    id?: number;
    job_post_id: number;
    user_id: number;
    cover_message: string;
    resume_url: string;
    created_at?: string;
};