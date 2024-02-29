import TableMigration from "./TableMigration";

export default class ChallengesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists challenges (
            id int AUTO_INCREMENT primary key,
            title varchar(255),
            description text,
            topic varchar(255),
            level varchar(255),
            is_public boolean,
            type enum('in_out', 'project'),
            creator_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(creator_id) references users(id)
        );`);
    }

    name(): string { return "Challenges" };
    tableName(): string { return "challenges" };
}