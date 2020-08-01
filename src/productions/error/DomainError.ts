// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
/* istanbul ignore file */
export default class DomainError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
