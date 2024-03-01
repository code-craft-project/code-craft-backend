import TableMigration from "./TableMigration";

export default class OrganizationsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists organizations (
            id int AUTO_INCREMENT primary key,
            name varchar(255),
            creator_id int,
            profile_image_url varchar(255),
            type varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(creator_id) references users(id)
        );`);
    }

    name(): string { return "Organizations" };
    tableName(): string { return "organizations" };
}