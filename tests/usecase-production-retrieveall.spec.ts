import retrievePersistedProductions from '../src/productions/application/RetrieveProductions';
import {Production} from '../src/productions/domain/Production';
import validJson from './_validProductionJson';
import InfrastructureError from '../src/productions/error/InfrastructureError';

test('UseCase: Retrieve all Productions through fetch', async () => {
    const expectedResult = [Production.fromJson(validJson)];
    const fetch = () => Promise.resolve(expectedResult);

    const result = await retrievePersistedProductions(fetch)();
    expect(result).toStrictEqual(expectedResult);
});

test('UseCase: Errors while retrieving result in specific error', async () => {
    const thrownError = new Error('12bangbang12');
    const fetch = (): Promise<Production[]> => { throw thrownError };
    return new Promise((done, fail) => {
        retrievePersistedProductions(fetch)()
            .then(() => fail(new Error('No error thrown')))
            .catch((e: Error) => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('Retrieving all Productions');
                expect(e.message).toContain('12bangbang12');
                done();
            });
    });
});

