import TableMigration from "./TableMigration";

export default class TeamsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists teams (
            id int AUTO_INCREMENT primary key,
            name varchar(255),
            description varchar(255),
            is_private boolean,
            password varchar(255),
            leader_id int,
            event_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(leader_id) references event_participants(id),
            foreign key(event_id) references events(id)
        );`);
    }

    name(): string { return "Teams" };
    tableName(): string { return "teams" };
}