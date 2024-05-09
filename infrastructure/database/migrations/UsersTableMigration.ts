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
            profile_image_url text,
            bio varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    }

    name(): string { return "Users" };
    tableName(): string { return "users" };
}