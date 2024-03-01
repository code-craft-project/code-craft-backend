import BaseValidator from "./BaseValidator";

export default class OrganizationValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["name", "type"];
    }
};