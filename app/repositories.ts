import { MySQLDatabase } from "@/infrastructure/database/MySQLDatabase";
import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import CompaniesRepository from "@/infrastructure/database/repositories/CompaniesRepository";
import UserSessionsRepository from "@/infrastructure/database/repositories/UserSessionsRepository";
import UsersRepository from "@/infrastructure/database/repositories/UsersRepository";

const database = new MySQLDatabase();

export const usersRepository = new UsersRepository(database);
export const userSessionsRepository = new UserSessionsRepository(database);
export const challengesRepository = new ChallengesRepository(database);
export const companiesRepository = new CompaniesRepository(database);