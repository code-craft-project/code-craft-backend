import BaseValidator from "./BaseValidator";

export default class EventValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["title", "description", "is_public", "start_at", "end_at", "organization_id", "is_team_based"];
    }
};