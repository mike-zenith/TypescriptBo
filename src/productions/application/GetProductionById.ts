import {Production} from '../domain/Production';
import InfrastructureError from '../error/InfrastructureError';

export default function getPersistedProductionById(fetch: (id: string) => Promise<Production>): (id: string) => Promise<Production> {
    return (id: string): Promise<Production> =>
        fetch(id)
            .catch(e => { throw InfrastructureError.when('Getting Production', id, e); });
}
