import BaseValidator from "./BaseValidator";

export default class ChallengeValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["creator_id", "is_public", "level", "name", "topic", "type"];
    }
};