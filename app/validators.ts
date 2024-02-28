import ChallengeValidator from "@/infrastructure/validators/ChallengeValidator";
import CredentialsValidator from "@/infrastructure/validators/CredentialsValidator";
import UserValidator from "@/infrastructure/validators/UserValidator";

export const challenge_validator = new ChallengeValidator();
export const credentials_validator = new CredentialsValidator();
export const user_validator = new UserValidator();