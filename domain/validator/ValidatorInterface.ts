import { ValidatorResult } from "./ValidatorResult";

export interface ValidatorInterface {
    properties_to_validate: string[];
    validate(obj: any): ValidatorResult;
};