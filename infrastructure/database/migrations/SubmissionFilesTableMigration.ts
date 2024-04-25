import TableMigration from "./TableMigration";

export default class SubmissionFilesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists submission_files (
            id int AUTO_INCREMENT primary key,
            submission_id int,
            file_url varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(submission_id) references submissions(id)
        );`);
    }

    name(): string { return "SubmissionFiles" };
    tableName(): string { return "submission_files" };
}