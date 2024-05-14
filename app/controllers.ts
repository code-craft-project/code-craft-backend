import AuthController from "./controllers/AuthController";
import ChallengesController from "./controllers/ChallengesController";
import EventsController from "./controllers/EventsController";
import FilesServeController from "./controllers/FilesServeController";
import JobPostsController from "./controllers/JobPostsController";
import OrganizationsController, { OrganizationsControllerConfig } from "./controllers/OrganizationsController";
import SearchController from "./controllers/SearchController";
import UploadController from "./controllers/UploadController";
import UsersController from "./controllers/UsersController";
import { challengesService, eventsService, jobPostsService, membersService, organizationsService, permissionsService, searchService, userSessionsService, usersService } from "./services";
import { challengeValidator, credentialsValidator, eventValidator, jobPostValidator, memberValidator, organizationValidator, permissionValidator, teamValidator, userValidator } from "./validators";

const organizationsControllerConfig: OrganizationsControllerConfig = {
    challengesService,
    eventsService,
    membersService,
    memberValidator,
    organizationsService,
    organizationValidator,
    permissionsService,
    permissionValidator,
    challengeValidator,
    usersService
};

// IMPORTANT: When adding new method to a controller, it must be an arrow function so it can capture the class instance when using 'this'.
export const usersController = new UsersController(usersService);
export const authController = new AuthController(usersService, userSessionsService, credentialsValidator, userValidator);
export const challengesController = new ChallengesController(challengesService, challengeValidator);
export const organizationsController = new OrganizationsController(organizationsControllerConfig);
export const jobPostsController = new JobPostsController(jobPostsService, membersService, jobPostValidator);
export const eventsController = new EventsController(eventsService, membersService, eventValidator, teamValidator, challengeValidator, challengesService);
export const uploadController = new UploadController();
export const filesServeController = new FilesServeController();
export const searchController = new SearchController(searchService);
