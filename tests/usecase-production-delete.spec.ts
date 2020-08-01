import validJson from './_validProductionJson';
import deletePersistedProduction from '../src/productions/application/DeleteProduction';
import {Production} from '../src/productions/domain/Production';
import InfrastructureError from '../src/productions/error/InfrastructureError';

test('UseCase: Production can be deleted by Id', async () => {
    const id = JSON.parse(validJson).Id;
    const production = Production.fromJson(validJson);
    const deleteFromStorage = jest.fn();
    const retrieveById = jest.fn().mockReturnValue(Promise.resolve(production));

    await deletePersistedProduction(retrieveById, deleteFromStorage)(id);

    expect(deleteFromStorage).toHaveBeenCalledWith(id);
    expect(retrieveById).toHaveBeenCalledWith(id);
});

test('UseCase: Errors while deleting production are converted to specific error /retrieve', async () => {
    const error = new Error('12retrieving error12')
    const id = JSON.parse(validJson).Id;
    const deleteFromStorage = jest.fn();
    const retrieveById = jest.fn().mockReturnValue(Promise.reject(error));

    return new Promise((done, fail) => {
        deletePersistedProduction(retrieveById, deleteFromStorage)(id)
            .then(() => fail(new Error('No error thrown')))
            .catch((e: Error) => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('Deleting Production');
                expect(e.message).toContain(id);
                expect(e.message).toContain('12retrieving error12');
                done();
            });
    });
});

test('UseCase: Errors while deleting production are converted to specific error /delete', async () => {
    const error = new Error('12deleting error12')
    const id = JSON.parse(validJson).Id;
    const production = Production.fromJson(validJson);
    const deleteFromStorage = () => Promise.reject(error);
    const retrieveById = () => Promise.resolve(production);

    return new Promise((done, fail) => {
        deletePersistedProduction(retrieveById, deleteFromStorage)(id)
            .then(() => fail(new Error('No error thrown')))
            .catch((e: Error) => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('Deleting Production');
                expect(e.message).toContain(id);
                expect(e.message).toContain('12deleting error12');
                done();
            });
    });
});
