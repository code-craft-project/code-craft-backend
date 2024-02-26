import TableMigration from "./TableMigration";

export default class ClubsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists clubs (
            id int AUTO_INCREMENT primary key,
            name varchar(255),
            leader_id int,
            profile_image_url varchar(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(leader_id) references users(id)
        );`);
    }

    name(): string { return "Clubs" };
    tableName(): string { return "clubs" };
}