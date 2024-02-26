import TableMigration from "./TableMigration";

export default class UsersTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists users (
            id int AUTO_INCREMENT primary key,
            username varchar(255) not null,
            first_name varchar(255) not null,
            last_name varchar(255) not null,
            email varchar(255) not null,
            password varchar(255) not null,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            profile_image_url varchar(255)
        );`);
    }

    name(): string { return "Users" };
    tableName(): string { return "users" };
}