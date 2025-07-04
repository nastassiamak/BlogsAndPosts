import {OutputErrorsType} from "../utils/errorUtils";

export class BusinessRuleError extends Error {
    public errors: OutputErrorsType;
    constructor(errors: OutputErrorsType) {
        super(errors.errorsMessages.map(e => `${e.field}: ${e.message}`).join('; '));
        this.errors = errors;
    }
}