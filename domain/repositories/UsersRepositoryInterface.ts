export const USER_SELECT_PROPS: string = 'users.id as id, username, first_name, last_name, email, password, profile_image_url, users.created_at as created_at, users.updated_at as updated_at';
export const USER_JOIN_PROPS: string = "'id', users.id, 'username', users.username, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'password', users.password, 'profile_image_url', users.profile_image_url, 'created_at', users.created_at, 'updated_at', users.updated_at";
export const USER_CREATE_PROPS: string = 'username, first_name, last_name, email, password, profile_image_url';

export interface UsersRepositoryInterface {
    createUser(user: UserEntity): Promise<InsertResultInterface | null>;
    getUserById(id: number): Promise<UserEntity | null>;
    getUserByUsername(username: string): Promise<UserEntity | null>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
    updateUser(user_id: number, user: UserEntity): Promise<InsertResultInterface | null>;
};