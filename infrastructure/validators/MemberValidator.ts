import BaseValidator from "./BaseValidator";

export default class MemberValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["role","user_id","organization_id"];
    }
};