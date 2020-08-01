// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
/* istanbul ignore file */
export default class InfrastructureError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public static when(action: string, withData: any, prev: Error): InfrastructureError {
        return new InfrastructureError(
            `InfrastructureError: when '${action}' with ${JSON.stringify(withData)}, resulting in '${prev.message}'`
        );
    }
}
