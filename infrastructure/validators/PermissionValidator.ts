import BaseValidator from "./BaseValidator";

export default class PermissionValidator extends BaseValidator {
    properties_to_validate: string[];
    constructor() {
        super();
        this.properties_to_validate = ["permission", "entity_id", "user_id", "organization_id"];
    }
};