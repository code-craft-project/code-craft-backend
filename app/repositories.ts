import { MySQLDatabase } from "@/infrastructure/database/MySQLDatabase";
import ChallengesRepository from "@/infrastructure/database/repositories/ChallengesRepository";
import EventsRepository from "@/infrastructure/database/repositories/EventsRepository";
import JobPostsRepository from "@/infrastructure/database/repositories/JobPostsRepository";
import MembersRepository from "@/infrastructure/database/repositories/MembersRepository";
import OrganizationsRepository from "@/infrastructure/database/repositories/OrganizationsRepository";
import PermissionsRepository from "@/infrastructure/database/repositories/PermissionsRepository";
import UserSessionsRepository from "@/infrastructure/database/repositories/UserSessionsRepository";
import UsersRepository from "@/infrastructure/database/repositories/UsersRepository";

const database = new MySQLDatabase();

export const usersRepository = new UsersRepository(database);
export const userSessionsRepository = new UserSessionsRepository(database);
export const challengesRepository = new ChallengesRepository(database);
export const organizationsRepository = new OrganizationsRepository(database);
export const jobPostsRepository = new JobPostsRepository(database);
export const eventsRepository = new EventsRepository(database);
export const membersRepository = new MembersRepository(database);
export const permissionsRepository = new PermissionsRepository(database);