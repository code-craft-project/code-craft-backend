import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import OrganizationValidator from "@/infrastructure/validators/OrganizationValidator";
import CredentialsValidator from "@/infrastructure/validators/CredentialsValidator";
import EventValidator from "@/infrastructure/validators/EventValidator";
import JobPostValidator from "@/infrastructure/validators/JobPostValidator";
import MemberValidator from "@/infrastructure/validators/MemberValidator";
import PermissionValidator from "@/infrastructure/validators/PermissionValidator";
import UserValidator from "@/infrastructure/validators/UserValidator";

export const challengeValidator = new ChallengeValidator();
export const credentialsValidator = new CredentialsValidator();
export const userValidator = new UserValidator();
export const organizationValidator = new OrganizationValidator();
export const jobPostValidator = new JobPostValidator();
export const eventValidator = new EventValidator();
export const memberValidator = new MemberValidator();
export const permissionValidator = new PermissionValidator();