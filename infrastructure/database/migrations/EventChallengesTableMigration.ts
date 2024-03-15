import TableMigration from "./TableMigration";

export default class EventChallengesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists event_challenges (
            id int AUTO_INCREMENT primary key,
            challenge_id int,
            event_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(challenge_id) references challenges(id),
            foreign key(event_id) references events(id)
        );`);
    }

    name(): string { return "EventChallenges" };
    tableName(): string { return "event_challenges" };
}