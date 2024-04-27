import TableMigration from "./TableMigration";

export default class OrganizationChallengesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists organization_challenges (
            id int AUTO_INCREMENT primary key,
            challenge_id int,
            organization_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(challenge_id) references challenges(id),
            foreign key(organization_id) references organizations(id)
        );`);
    }

    name(): string { return "OrganizationChallenges" };
    tableName(): string { return "organization_challenges" };
}