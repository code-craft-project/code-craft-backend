import TableMigration from "./TableMigration";

export default class MembersTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists members (
            id int AUTO_INCREMENT primary key,
            user_id int,
            role varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id)
        );`);
    }

    name(): string { return "Members" };
    tableName(): string { return "members" };
}