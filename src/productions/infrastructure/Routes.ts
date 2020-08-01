import { Router } from 'express';
import * as Repository from './InMemoryProductionStorage';
import createProduction from '../application/CreateProduction';
import {errorHttpOutput, jsonHttpOutput} from './JsonOutput';

const router = Router();

const createInMemoryProduction = createProduction(Repository.saveToInMemoryStorage);

router.post('/', async function create(req, res) {
    try {
        const production = await createInMemoryProduction(req.body);
        const output = jsonHttpOutput(res);
        res.status(200);
        production.output(output);
    } catch (e) {
        errorHttpOutput(e, res);
    }
});

export default router;
