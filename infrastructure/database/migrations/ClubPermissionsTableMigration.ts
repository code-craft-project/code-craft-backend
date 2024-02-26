import TableMigration from "./TableMigration";

export default class ClubPermissionsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists club_permissions (
            id int AUTO_INCREMENT primary key,
            permission_id int,
            club_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(permission_id) references permissions(id),
            foreign key(club_id) references clubs(id)
        );`);
    }

    name(): string { return "ClubPermissions" };
    tableName(): string { return "club_permissions" };
}