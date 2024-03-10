import { challengesRepository, eventsRepository, jobPostsRepository, membersRepository, organizationsRepository, permissionsRepository, userSessionsRepository, usersRepository } from "./repositories";
import ChallengesService from "./services/ChallengesService";
import EventsService from "./services/EventsService";
import JobPostsService from "./services/JobPostsService";
import MembersService from "./services/MembersService";
import OrganizationsService from "./services/OrganizationsService";
import PermissionsService from "./services/PermissionsService";
import UserSessionsService from "./services/UserSessionsService";
import UsersService from "./services/UsersService";

export const usersService = new UsersService(usersRepository);
export const userSessionsService = new UserSessionsService(userSessionsRepository);
export const challengesService = new ChallengesService(challengesRepository);
export const eventsService = new EventsService(eventsRepository);
export const membersService = new MembersService(membersRepository);
export const permissionsService = new PermissionsService(permissionsRepository);
export const organizationsService = new OrganizationsService(organizationsRepository);
export const jobPostsService = new JobPostsService(jobPostsRepository);
