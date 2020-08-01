import getPersistedProductionById from '../src/productions/application/GetProductionById';
import validJson from './_validProductionJson';
import {Production} from '../src/productions/domain/Production';
import InfrastructureError from '../src/productions/error/InfrastructureError';

test('UseCase: Get production by Id returns Production', async () => {
    const production = Production.fromJson(validJson);
    const id = JSON.parse(validJson).Id;
    const fetch = jest.fn().mockReturnValue(Promise.resolve(production));

    const result = await getPersistedProductionById(fetch)(id)
    expect(result).toStrictEqual(production);
    expect(fetch).toHaveBeenCalledWith(id);
});

test('UseCase: Errors while getting production are converted to specific error', () => {
    const error = new Error('12getting error12');
    const fetch = jest.fn().mockReturnValue(Promise.reject(error));
    const id = JSON.parse(validJson).Id;

    return new Promise((done, fail) => {
        getPersistedProductionById(fetch)(id)
            .then(() => fail(new Error('No error thrown')))
            .catch((e: Error) => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('Getting Production');
                expect(e.message).toContain(id);
                expect(e.message).toContain('12getting error12');
                done();
            });
    });
});
