import {Production, ProductionProperties} from '../domain/Production';

const storage = new Map<string, ProductionProperties>();

export const getFromInMemoryStorageById = (id: string) => Promise.resolve(new Production(storage.get(id)));
export const saveToInMemoryStorage = (prod: ProductionProperties) => { storage.set(prod.Id, prod); return Promise.resolve(); }
export const deleteFromInMemoryStorage = (id: string) => { storage.delete(id); return Promise.resolve(); };
export const getAllFromInMemoryStorage = () => Promise.resolve(Array.from(storage.values()).map(props => new Production(props)));
