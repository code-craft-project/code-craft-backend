import TableMigration from "./TableMigration";

export default class TestCaseInputsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists test_case_inputs (
            id int AUTO_INCREMENT primary key,
            test_case_id int,
            input text,
            type text,
            _index int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(test_case_id) references test_cases(id)
        );`);
    }

    name(): string { return "TestCaseInputs" };
    tableName(): string { return "test_case_inputs" };
}