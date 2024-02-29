import BaseValidator from "./BaseValidator";

export default class CompanyValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["name"];
    }
};