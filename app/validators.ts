import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import OrganizationValidator from "@/infrastructure/validators/OrganizationValidator";
import CredentialsValidator from "@/infrastructure/validators/CredentialsValidator";
import EventValidator from "@/infrastructure/validators/EventValidator";
import JobPostValidator from "@/infrastructure/validators/JobPostValidator";
import MemberValidator from "@/infrastructure/validators/MemberValidator";
import PermissionValidator from "@/infrastructure/validators/PermissionValidator";
import UserValidator from "@/infrastructure/validators/UserValidator";

export const challenge_validator = new ChallengeValidator();
export const credentials_validator = new CredentialsValidator();
export const user_validator = new UserValidator();
export const organization_validator = new OrganizationValidator();
export const job_post_validator = new JobPostValidator();
export const event_validator = new EventValidator();
export const member_validator = new MemberValidator();
export const permissions_validator = new PermissionValidator();