import TableMigration from "./TableMigration";

export default class SkillsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists skills (
            id int AUTO_INCREMENT primary key,
            name text,
            user_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id)
        );`);
    }

    name(): string { return "Skills" };
    tableName(): string { return "skills" };
}