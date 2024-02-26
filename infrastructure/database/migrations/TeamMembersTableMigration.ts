import TableMigration from "./TableMigration";

export default class TeamMembersTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists team_members (
            id int AUTO_INCREMENT primary key,
            team_id int,
            event_participant_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(team_id) references teams(id),
            foreign key(event_participant_id) references event_participants(id)
        );`);
    }

    name(): string { return "TeamMembers" };
    tableName(): string { return "team_members" };
}