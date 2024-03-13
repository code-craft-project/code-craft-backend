import TableMigration from "./TableMigration";

export default class EventsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists events (
            id int AUTO_INCREMENT primary key,
            title varchar(255),
            description varchar(255),
            is_public boolean,
            password varchar(255),
            is_team_based boolean,
            max_team_members int,
            logo_url varchar(255),
            start_at TIMESTAMP,
            end_at TIMESTAMP,
            organization_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(organization_id) references organizations(id)
        );`);
    }

    name(): string { return "Events" };
    tableName(): string { return "events" };
}