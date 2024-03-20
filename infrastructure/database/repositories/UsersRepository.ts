import { MySQLDatabase } from "../MySQLDatabase";
import { USER_CREATE_PROPS, USER_SELECT_PROPS, USER_SELECT_PROPS_WITH_PASSWORD, UsersRepositoryInterface } from "@/domain/repositories/UsersRepositoryInterface";

export default class UsersRepository implements UsersRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createUser(user: UserEntity): Promise<InsertResultInterface | null> {
        const result = await this.database.query<InsertResultInterface>(
            `insert into users (${USER_CREATE_PROPS}) values (?);`,
            [
                user.username,
                user.first_name,
                user.last_name,
                user.email,
                user.password,
                user.profile_image_url
            ]
        );
        if (result) {
            return result;
        }

        return null;
    }

    async getUserById(id: number, include_password?: boolean): Promise<UserEntity | null> {
        let users = await this.database.query<UserEntity[]>(`select ${include_password ? USER_SELECT_PROPS_WITH_PASSWORD : USER_SELECT_PROPS} from users where id = ?;`, [id]);
        if (!users || users?.length == 0) {
            return null;
        }

        return users[0];
    }

    async getUserByUsername(username: string, include_password?: boolean): Promise<UserEntity | null> {
        let users = await this.database.query<UserEntity[]>(`select ${include_password ? USER_SELECT_PROPS_WITH_PASSWORD : USER_SELECT_PROPS} from users where username = ?;`, [username]);
        if (!users || users?.length == 0) {
            return null;
        }

        return users[0];
    }

    async getUserByEmail(email: string, include_password?: boolean): Promise<UserEntity | null> {
        let users = await this.database.query<UserEntity[]>(`select ${include_password ? USER_SELECT_PROPS_WITH_PASSWORD : USER_SELECT_PROPS} from users where email = ?;`, [email]);
        if (!users || users?.length == 0) {
            return null;
        }

        return users[0];
    }

    async updateUser(user_id: number, user: UserEntity): Promise<InsertResultInterface | null> {
        let query = '';

        const params = [];
        const propertyNames = Object.getOwnPropertyNames(user);
        for (let i = 0; i < propertyNames.length; i++) {
            let property = propertyNames[i];
            query += `${property} = ?`;
            params.push((user as any)[property]);
            if (i < (propertyNames.length - 1)) {
                query += ',';
            }
        }

        let users = await this.database.query<InsertResultInterface>(`update users set ${query} where id = ?;`, ...params, user_id);
        if (!users) {
            return null;
        }

        return users;
    }
}