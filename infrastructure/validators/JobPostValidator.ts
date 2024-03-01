import BaseValidator from "./BaseValidator";

export default class JobPostValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["title", "description", "role", "type", "company_id"];
    }
};