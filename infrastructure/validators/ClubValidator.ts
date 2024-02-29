import BaseValidator from "./BaseValidator";

export default class ClubValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["name"];
    }
};