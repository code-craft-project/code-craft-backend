import { challengeCommentsRepository, challengesRepository, commentLikesRepository, eventChallengesRepository, eventParticipantsRepository, eventsRepository, jobApplicationsRepository, jobPostsRepository, membersRepository, organizationsRepository, permissionsRepository, teamMembersRepository, teamsRepository, userSessionsRepository, usersRepository } from "./repositories";
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
export const challengesService = new ChallengesService(challengesRepository, challengeCommentsRepository, commentLikesRepository);
export const eventsService = new EventsService(eventsRepository, eventParticipantsRepository, teamsRepository, teamMembersRepository, challengesRepository, eventChallengesRepository);
export const membersService = new MembersService(membersRepository);
export const permissionsService = new PermissionsService(permissionsRepository);
export const organizationsService = new OrganizationsService(organizationsRepository);
export const jobPostsService = new JobPostsService(jobPostsRepository, jobApplicationsRepository);
