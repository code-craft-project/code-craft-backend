import 'dotenv/config';
import 'module-alias/register';

import { MySQLDatabase } from "../MySQLDatabase";
import { DatabaseMigration } from "./DatabaseMigration";
import Logger from '@/infrastructure/logger/Logger';

const logger = new Logger();
const databaseMigration = new DatabaseMigration(new MySQLDatabase(), logger);

const argv = process.argv;

const action = argv[2] || "create";

if (action == "create") {
    databaseMigration.migrateAll().then(() => {
        logger.success("✅ All Tables has been created");
    });
}

if (action == "clean") {
    databaseMigration.dropAll().then(() => {
        logger.success("✅ All Tables has been dropped");
    });
}