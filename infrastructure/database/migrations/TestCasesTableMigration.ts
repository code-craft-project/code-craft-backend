import TableMigration from "./TableMigration";

export default class TestCasesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists test_cases (
            id int AUTO_INCREMENT primary key,
            challenge_id int,
            output text,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(challenge_id) references challenges(id)
        );`);
    }

    name(): string { return "TestCases" };
    tableName(): string { return "test_cases" };
}