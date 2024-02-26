import TableMigration from "./TableMigration";

export default class JobApplicationsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists job_applications (
            id int AUTO_INCREMENT primary key,
            job_post_id int,
            user_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(job_post_id) references job_posts(id),
            foreign key(user_id) references users(id)
        );`);
    }

    name(): string { return "JobApplications" };
    tableName(): string { return "job_applications" };
}