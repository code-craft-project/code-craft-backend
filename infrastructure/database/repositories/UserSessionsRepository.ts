import { USER_SESSION_CREATE_PROPS, UserSessionsRepositoryInterface } from "@/domain/repositories/UserSessionsRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";

export default class UserSessionsRepository implements UserSessionsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createUserSession(user_session: UserSessionInterface): Promise<InsertResultInterface | null> {
        const result = await this.database.query<InsertResultInterface>(
            `insert into user_sessions (${USER_SESSION_CREATE_PROPS}) values (?);`,
            [
                user_session.user_id,
                user_session.access_token
            ]
        );
        if (result) {
            return result;
        }

        return null;
    }
}