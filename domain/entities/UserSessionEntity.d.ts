interface UserSessionEntity {
    id?: number;
    user_id: number;
    access_token: string;
    created_at?: date;
};