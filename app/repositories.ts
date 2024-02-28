import { MySQLDatabase } from "@/infrastructure/database/MySQLDatabase";
import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import UsersRepository from "@/infrastructure/database/repositories/UsersRepository";

const database = new MySQLDatabase();

export const usersRepository = new UsersRepository(database);
export const challengesRepository = new ChallengesRepository(database);