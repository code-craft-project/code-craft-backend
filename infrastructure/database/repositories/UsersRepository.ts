import { MySQLDatabase } from "../MySQLDatabase";
import { USER_CREATE_PROPS, USER_SELECT_PROPS, UsersRepositoryInterface } from "@/domain/repositories/UsersRepositoryInterface";

export default class UsersRepository implements UsersRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createUser(user: UserInterface): Promise<UserInterface | null> {
        const result = await this.database.query<UserInterface>(
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

    async getUserById(id: number): Promise<UserInterface | null> {
        let users = await this.database.query<UserInterface[]>(`select ${USER_SELECT_PROPS} from users where id = ?;`, [id]);
        if (!users || users?.length == 0) {
            return null;
        }

        return users[0];
    }

    async getUserByUsername(username: string): Promise<UserInterface | null> {
        let users = await this.database.query<UserInterface[]>(`select ${USER_SELECT_PROPS} from users where username = ?;`, [username]);
        if (!users || users?.length == 0) {
            return null;
        }

        return users[0];
    }

    async getUserByEmail(email: string): Promise<UserInterface | null> {
        let users = await this.database.query<UserInterface[]>(`select ${USER_SELECT_PROPS} from users where email = ?;`, [email]);
        if (!users || users?.length == 0) {
            return null;
        }

        return users[0];
    }

}