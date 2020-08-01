import {Production} from '../domain/Production';
import InfrastructureError from '../error/InfrastructureError';

export default function retrieveProductions(fetch: () => Promise<Production[]>): () => Promise<Production[]> {
    return async() => {
        try {
            return fetch();
        } catch (e) {
            throw InfrastructureError.when('Retrieving all Productions', fetch.toString(), e);
        }
    }
}
