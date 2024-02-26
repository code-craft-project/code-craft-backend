import TableMigration from "./TableMigration";

export default class EventParticipantsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists event_participants (
            id int AUTO_INCREMENT primary key,
            user_id int,
            event_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id),
            foreign key(event_id) references events(id)
        );`);
    }

    name(): string { return "EventParticipants" };
    tableName(): string { return "event_participants" };
}