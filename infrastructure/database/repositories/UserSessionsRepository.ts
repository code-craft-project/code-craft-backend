import { USER_SESSION_CREATE_PROPS, USER_SESSION_SELECT_PROPS, UserSessionsRepositoryInterface } from "@/domain/repositories/UserSessionsRepositoryInterface";
import { MySQLDatabase } from "../MySQLDatabase";

export default class UserSessionsRepository implements UserSessionsRepositoryInterface {
    database: MySQLDatabase;
    constructor(database: MySQLDatabase) {
        this.database = database;
    }

    async createUserSession(user_session: UserSessionEntity): Promise<InsertResultInterface | null> {
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

    async deleteUserSessionByAccessToken(accessToken: string): Promise<InsertResultInterface | null> {
        let result = await this.database.query<InsertResultInterface>(`delete from user_sessions where access_token = ?;`, [accessToken]);

        if (result) {
            return result;
        }

        return null;
    }

    async getUserSessionByAccessToken(accessToken: string): Promise<UserSessionEntity | null> {
        let data = await this.database.query<UserSessionEntity[]>(`select ${USER_SESSION_SELECT_PROPS} from user_sessions where access_token = ?;`, accessToken);

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }
}