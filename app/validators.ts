import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import ClubValidator from "@/infrastructure/validators/ClubValidator";
import CompanyValidator from "@/infrastructure/validators/CompanyValidator";
import CredentialsValidator from "@/infrastructure/validators/CredentialsValidator";
import JobPostValidator from "@/infrastructure/validators/JobPostValidator";
import UserValidator from "@/infrastructure/validators/UserValidator";

export const challenge_validator = new ChallengeValidator();
export const credentials_validator = new CredentialsValidator();
export const user_validator = new UserValidator();
export const company_validator = new CompanyValidator();
export const club_validator = new ClubValidator();
export const job_post_validator = new JobPostValidator();