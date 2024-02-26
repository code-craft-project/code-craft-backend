import TableMigration from "./TableMigration";

export default class SubmittionsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists submittions (
            id int AUTO_INCREMENT primary key,
            type varchar(255),
            content text,
            challenge_id int,
            user_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(challenge_id) references challenges(id),
            foreign key(user_id) references users(id)
        );`);
    }

    name(): string { return "Submittions" };
    tableName(): string { return "submittions" };
}