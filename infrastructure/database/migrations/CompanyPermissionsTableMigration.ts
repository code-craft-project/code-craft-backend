import TableMigration from "./TableMigration";

export default class CompanyPermissionsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists company_permissions (
            id int AUTO_INCREMENT primary key,
            permission_id int,
            company_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(permission_id) references permissions(id),
            foreign key(company_id) references companies(id)
        );`);
    }

    name(): string { return "CompanyPermissions" };
    tableName(): string { return "company_permissions" };
}