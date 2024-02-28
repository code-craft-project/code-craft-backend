import TableMigration from "./TableMigration";

export default class UserSessionsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists user_sessions (
            id int AUTO_INCREMENT primary key,
            user_id int,
            access_token text,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id)
        );`);
    }

    name(): string { return "UserSessions" };
    tableName(): string { return "user_sessions" };
}