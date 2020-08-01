import createProduction from '../src/productions/application/CreateProduction';
import {Production, ProductionProperties} from '../src/productions/domain/Production';
import validJson from './_validProductionJson';
import getPersistedProductionById from '../src/productions/application/GetProductionById';
import deletePersistedProduction from '../src/productions/application/DeleteProduction';
import retrieveProductions from '../src/productions/application/RetrieveProductions';
import updateProductionByJson from '../src/productions/application/UpdateProduction';

let storage: Map<string, ProductionProperties>;

const getFromInMemoryStorageById = (id: string) => Promise.resolve(new Production(storage.get(id)));
const saveToInMemoryStorage = (prod: ProductionProperties) => { storage.set(prod.Id, prod); return Promise.resolve(); }
const deleteFromInMemoryStorage = (id: string) => { storage.delete(id); return Promise.resolve(); };
const getAllFromInMemoryStorage = () => Promise.resolve(Array.from(storage.values()).map(props => new Production(props)));

const persistProduction = createProduction(saveToInMemoryStorage);
const retrieveProduction = getPersistedProductionById(getFromInMemoryStorageById);
const retrieveAllProductions = retrieveProductions(getAllFromInMemoryStorage);
const deleteProduction = deletePersistedProduction(getFromInMemoryStorageById, deleteFromInMemoryStorage);
const updateProduction = updateProductionByJson(retrieveProduction, saveToInMemoryStorage);

const id = JSON.parse(validJson).Id;

beforeEach(() => {
    storage = new Map<string, ProductionProperties>([]);
});

test('Feature: Retrieving created Production', async () => {
    const storedProduction = await persistProduction(validJson);
    const retrievedProduction = await retrieveProduction(id);

    expect(retrievedProduction).toStrictEqual(storedProduction);
    expect([retrievedProduction]).toStrictEqual(await retrieveAllProductions());
});

test('Feature: Deleting a persisted Production', async () => {
    await persistProduction(validJson);
    await deleteProduction(id);

    expect(storage.has(id)).toBeFalsy();
    expect([]).toStrictEqual(await retrieveAllProductions());
});

test('Feature: Updating a persisted Production', async () => {
    await persistProduction(validJson);
    await updateProduction(id, '{"Name": "gejza"}');
    expect(storage.get(id).Name).toStrictEqual('gejza');
});
