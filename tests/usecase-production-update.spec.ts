import getPersistedProductionById from '../src/productions/application/GetProductionById';
import validJson from './_validProductionJson';
import {Production} from '../src/productions/domain/Production';
import InfrastructureError from '../src/productions/error/InfrastructureError';
import updateProduction from '../src/productions/application/UpdateProduction';
import DomainError from '../src/productions/error/DomainError';

let production:Production;
let id: string;

beforeEach(() => {
    production = Production.fromJson(validJson);
    id = JSON.parse(validJson).Id;
})

test('UseCase: Update production from json', async () => {
    const fetch = jest.fn().mockReturnValue(Promise.resolve(production));
    const save = jest.fn().mockReturnValue(Promise.resolve(production));

    const updateProperties = {
        Abstract: 'Nyolc',
        AgeRating: 12,
        AvailabilityFromUtcIso: new Date('2020-10-21T22:00:00Z'),
        BackgroundUrl: 'http://about:blank/img.png',
        Cast: 'John',
        Category: 'MOVIE',
        Director: 'Marcos',
        EditedAbstract: 'Három',
        Genre: 'vígjáték',
        Name: 'Batman2',
        ProductionYear: 2000,
    };
    const updateValues = JSON.stringify(updateProperties);

    const updatedProduction = await updateProduction(getPersistedProductionById(fetch), save)(id, updateValues);

    expect(Production.fromJson(validJson)).not.toStrictEqual(updatedProduction);
    expect(fetch).toHaveBeenCalledWith(id);
    expect(save).toHaveBeenCalledWith({ ... updateProperties, Id: id });
});

test('UseCase: Update does not hide domain errors', () => {
    const fetch = jest.fn().mockReturnValue(Promise.resolve(production));
    const save = jest.fn().mockReturnValue(Promise.resolve(production));

    const updateValues = '{"Id": ""}';
    return new Promise((done, fail) => {
        updateProduction(getPersistedProductionById(fetch), save)(id, updateValues)
            .then(() => fail(new Error('Should throw error')))
            .catch(e => {
                expect(e).toBeInstanceOf(DomainError);
                done();
            });
    })
});

test('UseCase: Update re-throws errors coming from infrastructure  /get by id', () => {
    const error = new Error('bumbum fetch failed');

    const fetch = jest.fn().mockReturnValue(Promise.reject(error));
    const save = jest.fn().mockReturnValue(Promise.resolve(production));

    const updateValues = '{"AgeRating":12}';
    return new Promise((done, fail) => {
        updateProduction(getPersistedProductionById(fetch), save)(id, updateValues)
            .then(() => fail(new Error('Should throw error')))
            .catch(e => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('bumbum fetch failed');
                expect(e.message).toContain('Updating Production');
                done();
            });
    })
});

test('UseCase: Update re-throws errors coming from infrastructure /persist', () => {
    const error = new Error('bumbum persist failed');

    const fetch = jest.fn().mockReturnValue(Promise.resolve(production));
    const save = jest.fn().mockReturnValue(Promise.reject(error));

    const updateValues = '{"AgeRating":12}';
    return new Promise((done, fail) => {
        updateProduction(getPersistedProductionById(fetch), save)(id, updateValues)
            .then(() => fail(new Error('Should throw error')))
            .catch(e => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('Updating Production');
                expect(e.message).toContain('bumbum persist failed');
                done();
            });
    })
});
