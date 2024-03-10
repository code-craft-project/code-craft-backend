interface MemberEntity {
    id?: number;
    user_id: number;
    role: 'admin' | 'events_manager' | 'challenges_manager' | 'job_posts_manager';
    organization_id: number;
    created_at?: timestamp;
};