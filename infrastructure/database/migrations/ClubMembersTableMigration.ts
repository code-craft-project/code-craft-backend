import TableMigration from "./TableMigration";

export default class ClubMembersTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists club_members (
            id int AUTO_INCREMENT primary key,
            member_id int,
            club_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(member_id) references members(id),
            foreign key(club_id) references clubs(id)
        );`);
    }

    name(): string { return "ClubMembers" };
    tableName(): string { return "club_members" };
}