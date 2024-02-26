import TableMigration from "./TableMigration";

export default class CompanyMembersTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists company_members (
            id int AUTO_INCREMENT primary key,
            member_id int,
            company_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(member_id) references members(id),
            foreign key(company_id) references companies(id)
        );`);
    }

    name(): string { return "CompanyMembers" };
    tableName(): string { return "company_members" };
}