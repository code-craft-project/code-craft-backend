import TableMigration from "./TableMigration";

export default class ChallengeCommentsTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists challenge_comments (
            id int AUTO_INCREMENT primary key,
            comment varchar(255),
            is_reply boolean,
            user_id int,
            challenge_id int,
            reply_to_comment_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id),
            foreign key(challenge_id) references challenges(id),
            foreign key(reply_to_comment_id) references challenge_comments(id)
        );`);
    }

    name(): string { return "ChallengeComments" };
    tableName(): string { return "challenge_comments" };
}