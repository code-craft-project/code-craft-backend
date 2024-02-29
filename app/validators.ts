import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import CompanyValidator from "@/infrastructure/validators/CompanyValidator";
import CredentialsValidator from "@/infrastructure/validators/CredentialsValidator";
import UserValidator from "@/infrastructure/validators/UserValidator";

export const challenge_validator = new ChallengeValidator();
export const credentials_validator = new CredentialsValidator();
export const user_validator = new UserValidator();
export const company_validator = new CompanyValidator();