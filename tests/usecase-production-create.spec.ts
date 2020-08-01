import {Production, ProductionProperties} from '../src/productions/domain/Production';
import persistedCreateProduction from '../src/productions/application/CreateProduction';
import InfrastructureError from '../src/productions/error/InfrastructureError';
import DomainError from '../src/productions/error/DomainError';
import validJson from './_validProductionJson';

let storagePersist: (prod: ProductionProperties) => Promise<void>;

beforeEach(() => {
    storagePersist = () => Promise.resolve();
});

test('UseCase: Production can be created from request', async () => {
    const production = await persistedCreateProduction(storagePersist)(validJson);
    expect(production).toBeInstanceOf(Production);
});

test('UseCase: New production is persisted', () => {
    const expectedProductionProperties = {
        Abstract: 'Három esztendővel azután, hogy Gotham maszkos igazságosztója eltűnt, Bruce Wayne unokatestvére, Kate Kane visszatér a városba, Hogy legyőzze démonait, magára ölti Batwoman álcáját, és Batman nyomdokaiba lépve szembeszáll a bűnözőkkel.',
        AgeRating: 12,
        AvailabilityFromUtcIso: new Date('2019-12-21T23:00:00Z'),
        BackgroundUrl: 'http://hboce-preprod-vod-hss.akamaized.net/d44b68b6-9fa1-f93d-9a84-84b3a941dc98_p106585_hbo/images/30445957.jpg',
        Cast: 'Ruby Rose, Rachel Skarsten, Meagan Tandy, Camrus Johnson, Nicole Kang',
        Category: 'SERIES',
        Director: 'Marcos Siega',
        EditedAbstract: 'Három esztendővel azután, hogy Gotham maszkos igazságosztója eltűnt, Bruce Wayne unokatestvére, Kate Kane visszatér a városba, Hogy legyőzze démonait, magára ölti Batwoman álcáját, és Batman nyomdokaiba lépve szembeszáll a bűnözőkkel.',
        Genre: 'akció',
        Id: '604b537a-5ddb-2cd4-9c4e-8cccd248831d',
        Name: 'Batwoman',
        ProductionYear: 2019,
    };
    let productionProperties: ProductionProperties = {};
    storagePersist = (request) => { productionProperties = request;  return Promise.resolve() };
    persistedCreateProduction(storagePersist)(validJson);
    expect(productionProperties).toStrictEqual(expectedProductionProperties);
});

test('UseCase: Failed saving returns error', () => {
    const thrownError = new Error('12something went terribly wrong12');
    storagePersist = (): Promise<void> => Promise.reject(thrownError);
    return new Promise((done, fail) => {
        persistedCreateProduction(storagePersist)(validJson)
            .then(() => fail(new Error('No error thrown')))
            .catch((e: Error) => {
                expect(e).toBeInstanceOf(InfrastructureError);
                expect(e.message).toContain('Saving Production');
                expect(e.message).toContain(JSON.stringify(validJson));
                expect(e.message).toContain('12something went terribly wrong12');
                done();
            });
    });
});

test('UseCase: Failed creation does not suppress domain errors', () => {
    const json = '{}';
    expect(() => persistedCreateProduction(storagePersist)(json)).toThrowError(DomainError);
});


