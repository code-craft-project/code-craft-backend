import OrganizationChallengesRepository from "@/infrastructure/database/repositories/OrganizationChallengesRepository";
import { challengeCommentsRepository, challengesRepository, commentLikesRepository, eventChallengesRepository, eventParticipantsRepository, eventsRepository, jobApplicationsRepository, jobPostsRepository, membersRepository, organizationChallengesRepository, organizationsRepository, permissionsRepository, submissionsRepository, teamMembersRepository, teamsRepository, testCaseInputsRepository, testCasesRepository, userSessionsRepository, usersRepository } from "./repositories";
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
export const challengesService = new ChallengesService(challengesRepository, challengeCommentsRepository, commentLikesRepository, testCasesRepository, testCaseInputsRepository, submissionsRepository);
export const eventsService = new EventsService(eventsRepository, eventParticipantsRepository, teamsRepository, teamMembersRepository, challengesRepository, eventChallengesRepository, testCasesRepository, testCaseInputsRepository);
export const membersService = new MembersService(membersRepository);
export const permissionsService = new PermissionsService(permissionsRepository);
export const organizationsService = new OrganizationsService(organizationsRepository, jobPostsRepository, jobApplicationsRepository, eventsRepository, challengesRepository, organizationChallengesRepository, membersRepository, testCasesRepository, testCaseInputsRepository);
export const jobPostsService = new JobPostsService(jobPostsRepository, jobApplicationsRepository);
