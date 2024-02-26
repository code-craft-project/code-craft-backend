import TableMigration from "./TableMigration";

export default class CommentLikesTableMigration extends TableMigration {
    async createTable(): Promise<void> {
        await this.database.query(`create table if not exists comment_likes (
            id int AUTO_INCREMENT primary key,
            user_id int,
            comment_id int,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign key(user_id) references users(id),
            foreign key(comment_id) references challenge_comments(id)
        );`);
    }

    name(): string { return "CommentLikes" };
    tableName(): string { return "comment_likes" };
}