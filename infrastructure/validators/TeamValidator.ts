import BaseValidator from "./BaseValidator";

export default class TeamValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["name", "description", "is_private", "password", "leader_id", "event_id"];
    }
};