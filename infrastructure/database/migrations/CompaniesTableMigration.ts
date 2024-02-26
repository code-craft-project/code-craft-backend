import TableMigration from "./TableMigration";

export default class CompaniesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists companies (
            id int AUTO_INCREMENT primary key,
            name varchar(255),
            owner_id int,
            profile_image_url varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(owner_id) references users(id)
        );`);
    }

    name(): string { return "Companies" };
    tableName(): string { return "companies" };
}