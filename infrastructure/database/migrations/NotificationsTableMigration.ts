import TableMigration from "./TableMigration";

export default class NotificationsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists notifications (
            id int AUTO_INCREMENT primary key,
            title varchar(255),
            description varchar(255),
            user_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id)
        );`);
    }

    name(): string { return "Notifications" };
    tableName(): string { return "notifications" };
}