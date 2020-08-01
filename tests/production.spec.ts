import { Production } from '../src/productions/domain/Production';
import InvalidArgumentError from '../src/productions/error/InvalidArgumentError';
import DomainError from '../src/productions/error/DomainError';
import ValidationError from '../src/productions/error/ValidationError';
import validJson from './_validProductionJson';

const validProductionFromJson = JSON.parse(validJson);

test('Production: can be displayed', () => {
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
    const service = jest.fn();
    const subject = Production.fromJson(validJson);

    subject.output(service);
    expect(service).toHaveBeenCalledWith(expectedProductionProperties);
});

test('Production: can be saved through channel', () => {
    const service = jest.fn();
    const subject = Production.fromJson(validJson);

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

    subject.save(service);
    expect(service).toHaveBeenCalledWith(expectedProductionProperties);
});

test('Production: can be deleted from storage', () => {
    const storage = jest.fn();
    const subject = Production.fromJson(validJson);
    subject.delete(storage);
    expect(storage).toHaveBeenCalledWith('604b537a-5ddb-2cd4-9c4e-8cccd248831d');
});

test('Production: can be updated', () => {
    const subject = Production.fromJson(validJson);
    const service = jest.fn();
    const updateProperties = {
        Abstract: 'Három',
        AgeRating: 16,
        AvailabilityFromUtcIso: new Date('2020-12-21T23:00:00Z'),
        BackgroundUrl: 'http://about:blank/img.jpg',
        Cast: 'John Travolta',
        Category: 'MOVIE',
        Director: 'Marcos Narcos',
        EditedAbstract: 'Három esztendővel',
        Genre: 'romantikus',
        Name: 'Batman',
        ProductionYear: 2020,
    };
    subject.updateFromJson(JSON.stringify(updateProperties));
    subject.output(service);

    expect(service).toHaveBeenCalledWith({ ... updateProperties, Id: '604b537a-5ddb-2cd4-9c4e-8cccd248831d' });
});

const updateErrorCases: { case: string, in: string, expects: any[] }[] = [
    {
        case: 'json is invalid',
        in: '{',
        expects: [ InvalidArgumentError ]
    },
    {
        case: 'updating Id is not allowed',
        in: JSON.stringify({ Id: '604b537a-5ddb-2cd4-9c4e-8cccd248831d' }),
        expects: [ ValidationError, 'Production', 'Id', 'unrecognized_keys' ]
    },
];

(function generateUpdateErrorCases() {
    const updateTestCaseMap = {
        AgeRating: '20',
        BackgroundUrl: 123,
        Cast: 0,
        Category: 'TANK',
        Director: 22,
        EditedAbstract: 0xff,
        Genre: 9,
        Name: null,
        ProductionYear: 1887,
    };
    for(const [property, value] of Object.entries(updateTestCaseMap)) {
        updateErrorCases.push({
            case: `invalid ${property} (${value})`,
            in: JSON.stringify({ [property]: value }),
            expects: [ ValidationError, 'Production', property ]
        });
    }
})();

updateErrorCases.forEach(testCase => {
    test(`updating Production with invalid json: ${testCase.case}`, () => {
        const production = Production.fromJson(validJson);
        const throwExpectation = expect(() => production.updateFromJson(testCase.in));
        throwExpectation.toThrow(DomainError);
        testCase.expects.forEach(expectation => throwExpectation.toThrowError(expectation));
    });
})

const creationErrorCases: { case: string, in: string, expects: any[] }[] = [
    {
        case: 'non json string',
        in: 'nop',
        expects: [ InvalidArgumentError.whenReceiving('nop') ]
    },
    {
        case: 'invalid AgeRating (not a number)',
        in: JSON.stringify({ ... validProductionFromJson, AgeRating: '12' }),
        expects: [ ValidationError, 'Production', 'AgeRating', 'number' ]
    },
    {
        case: 'invalid AvailabilityFromUtcIso (not parsable as date)',
        in: JSON.stringify({ ... validProductionFromJson, AvailabilityFromUtcIso: 'dateyo' }),
        expects: [ ValidationError, 'Production', 'AvailabilityFromUtcIso', 'date' ]
    },
    {
        case: 'invalid ProductionYear (not number)',
        in: JSON.stringify({ ... validProductionFromJson, ProductionYear: '2020' }),
        expects: [ ValidationError, 'Production', 'ProductionYear', 'invalid_type' ]
    },
    {
        case: 'invalid ProductionYear (must be >= 1888)',
        in: JSON.stringify({ ... validProductionFromJson, ProductionYear: 1887 }),
        expects: [ ValidationError, 'Production', 'ProductionYear', 'should be greater than or equal to 1888' ]
    },
    {
        case: 'invalid Category (must be enum)',
        in: JSON.stringify({ ... validProductionFromJson, Category: 'HEROMOVIES' }),
        expects: [ ValidationError, 'Production', 'Category', 'invalid_enum', 'SERIES, MOVIE' ]
    },
];

(function generateMissingPropertiesFromValidJson() {
    for (const key of Object.keys(validProductionFromJson)) {
        // Category is checked differently as its an enum and is stricter than others
        if (key === 'Category') { continue; }
        const {[key]: omit, ...productionWithoutKey} = validProductionFromJson;
        creationErrorCases.push({
            case: `missing ${key}`,
            in: JSON.stringify(productionWithoutKey),
            expects: [ValidationError, 'Production', 'Required']
        });
    }
})();

creationErrorCases.forEach(testCase => {
    test(`creating new Production with invalid json: ${testCase.case}`, () => {
        const throwExpectation = expect(() => Production.fromJson(testCase.in));
        throwExpectation.toThrow(DomainError);
        testCase.expects.forEach(expectation => throwExpectation.toThrowError(expectation));
    });
});
