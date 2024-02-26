import TableMigration from "./TableMigration";

export default class CompanyEventsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists company_events (
            id int AUTO_INCREMENT primary key,
            event_id int,
            company_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(event_id) references events(id),
            foreign key(company_id) references companies(id)
        );`);
    }

    name(): string { return "CompanyEvents" };
    tableName(): string { return "company_events" };
}