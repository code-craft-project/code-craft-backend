import TableMigration from "./TableMigration";

export default class JobPostsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists job_posts (
            id int AUTO_INCREMENT primary key,
            title varchar(255),
            description varchar(255),
            role varchar(255),
            type varchar(255),
            organization_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(organization_id) references organizations(id)
        );`);
    }

    name(): string { return "JobPosts" };
    tableName(): string { return "job_posts" };
}