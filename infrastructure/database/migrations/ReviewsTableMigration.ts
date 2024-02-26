import TableMigration from "./TableMigration";

export default class ReviewsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists reviews (
            id int AUTO_INCREMENT primary key,
            message varchar(255),
            score int,
            challenge_id int,
            submittion_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(challenge_id) references challenges(id),
            foreign key(submittion_id) references submittions(id)
        );`);
    }

    name(): string { return "Reviews" };
    tableName(): string { return "reviews" };
}