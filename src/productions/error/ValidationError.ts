import DomainError from './DomainError';

export default class ValidationError extends DomainError {
    public static whenValidating(validating: any, against: any, issues: string): ValidationError {
        return new ValidationError(
            `Validation error occurred when validating '${JSON.stringify(validating)}' against ${against}: ${issues}`
        );
    }
}
