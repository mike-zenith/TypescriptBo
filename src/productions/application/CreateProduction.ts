import {Production, ProductionProperties} from '../domain/Production';
import InfrastructureError from '../error/InfrastructureError';

export default function persistedRequestProduction(persistThrough: (prod: ProductionProperties) => Promise<void>): (request: string) => Promise<Production> {
    return function persisted(request: string): Promise<Production> {
        const production = requestCreateProduction(request);
        return production.save(persistThrough)
            .then(() => production)
            .catch(e => { throw InfrastructureError.when('Saving Production', request, e); });
    }
}

export function requestCreateProduction(request: string): Production {
    return Production.fromJson(request);
}
