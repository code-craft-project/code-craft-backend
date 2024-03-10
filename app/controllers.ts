import AuthController from "./controllers/AuthController";
import ChallengesController from "./controllers/ChallengesController";
import EventsController from "./controllers/EventsController";
import JobPostsController from "./controllers/JobPostsController";
import OrganizationsController, { OrganizationsControllerConfig } from "./controllers/OrganizationsController";
import { challengesService, eventsService, jobPostsService, membersService, organizationsService, permissionsService, userSessionsService, usersService } from "./services";
import { challengeValidator, credentialsValidator, eventValidator, jobPostValidator, memberValidator, organizationValidator, permissionValidator, userValidator } from "./validators";

const organizationsControllerConfig: OrganizationsControllerConfig = {
    challengesService,
    eventsService,
    membersService,
    memberValidator,
    organizationsService,
    organizationValidator,
    permissionsService,
    permissionValidator
};

export const authController = new AuthController(usersService, userSessionsService, credentialsValidator, userValidator);
export const challengesController = new ChallengesController(challengesService, challengeValidator);
export const organizationsController = new OrganizationsController(organizationsControllerConfig);
export const jobPostsController = new JobPostsController(jobPostsService, jobPostValidator);
export const eventsController = new EventsController(eventsService, membersService, eventValidator);