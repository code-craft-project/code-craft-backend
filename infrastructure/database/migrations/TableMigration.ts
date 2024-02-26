import Logger from "@/infrastructure/logger/Logger";
import { MySQLDatabase } from "../MySQLDatabase";

export default class TableMigration {
    database: MySQLDatabase;
    logger: Logger;
    constructor(database: MySQLDatabase, logger: Logger) {
        this.database = database;
        this.logger = logger;
    }

    name(): string { return ""; }
    tableName(): string { return ""; }

    async createTable(): Promise<void> { };
    async drop(): Promise<void> {
        await this.database.query(`drop table ${this.tableName()}`);
        this.logger.info(`${this.name()} Table Dropped.`);
    };

    async migrate() {
        await this.createTable();
        this.logger.info(`${this.name()} Table Created.`);
    }
}