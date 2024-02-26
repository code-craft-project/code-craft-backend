import TableMigration from "./TableMigration";

export default class SubmittionFilesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists submittion_files (
            id int AUTO_INCREMENT primary key,
            submittion_id int,
            file_url varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(submittion_id) references submittions(id)
        );`);
    }

    name(): string { return "SubmittionFiles" };
    tableName(): string { return "submittion_files" };
}