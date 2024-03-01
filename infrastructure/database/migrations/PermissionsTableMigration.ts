import TableMigration from "./TableMigration";

export default class PermissionsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        // FIXME: Entity can have two references, its a challenge_id or event_id
        //        So the permission value must be either a 'challenge' or 'event'. 
        await this.database.query(`create table if not exists permissions (
            id int AUTO_INCREMENT primary key,
            permission varchar(255),
            entity_id int,
            user_id int,
            organization_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id),
            foreign key(organization_id) references organizations(id)
        );`);
        //        foreign key(entity_id) references challenges(id),
        //        foreign key(entity_id) references events(id),
    }

    name(): string { return "Permissions" };
    tableName(): string { return "permissions" };
}