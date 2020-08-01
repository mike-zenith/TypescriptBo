import InfrastructureError from '../error/InfrastructureError';
import {Production} from '../domain/Production';

export default function deletePersistedProduction(
    retrieveById: (id: string) => Promise<Production>,
    deleteFromStorage: (id: string) => Promise<void>
): (id: string) => Promise<void> {
    return id => retrieveById(id)
        .then(production => production.delete(deleteFromStorage))
        .catch(e => {
            throw InfrastructureError.when('Deleting Production', id, e);
        });
}
