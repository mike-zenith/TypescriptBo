import {Production, ProductionProperties} from '../domain/Production';
import DomainError from '../error/DomainError';
import InfrastructureError from '../error/InfrastructureError';

export default function updateProduction(
    getById: (id: string) => Promise<Production>,
    persist: (properties: ProductionProperties) => Promise<void>
): (id: string, json: string) => Promise<Production> {

    return async (id: string, json: string) => {
        try {
            const production = await getById(id);
            production.updateFromJson(json);
            await production.save(persist);
            return production;
        } catch (e) {
            if (e instanceof DomainError) {
                throw e;
            }
            throw InfrastructureError.when('Updating Production', json, e);
        }
    }

}
