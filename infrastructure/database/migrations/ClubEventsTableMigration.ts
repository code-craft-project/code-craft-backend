import TableMigration from "./TableMigration";

export default class ClubEventsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists club_events (
            id int AUTO_INCREMENT primary key,
            event_id int,
            club_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(event_id) references events(id),
            foreign key(club_id) references clubs(id)
        );`);
    }

    name(): string { return "ClubEvents" };
    tableName(): string { return "club_events" };
}