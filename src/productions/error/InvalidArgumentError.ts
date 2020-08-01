import DomainError from './DomainError';

export default class InvalidArgumentError extends DomainError {
    public static whenReceiving(invalidArgument: any): InvalidArgumentError {
        return new InvalidArgumentError(
            `Invalid argument error: ${JSON.stringify(invalidArgument)}`
        );
    }
}
