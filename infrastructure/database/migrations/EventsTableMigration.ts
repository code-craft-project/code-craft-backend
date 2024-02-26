import TableMigration from "./TableMigration";

export default class EventsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists events (
            id int AUTO_INCREMENT primary key,
            title varchar(255),
            description varchar(255),
            is_public boolean,
            password varchar(255),
            logo_url varchar(255),
            start_at TIMESTAMP,
            end_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    }

    name(): string { return "Events" };
    tableName(): string { return "events" };
}