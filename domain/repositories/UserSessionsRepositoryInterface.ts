export const USER_SESSION_SELECT_PROPS: string = 'user_sessions.id as id, user_sessions.user_id as user_id, access_token,user_sessions.created_at as created_at';
export const USER_SESSION_CREATE_PROPS: string = 'user_id, access_token';

export interface UserSessionsRepositoryInterface {
    createUserSession(user: UserSessionInterface): Promise<UserSessionInterface | null>;
};