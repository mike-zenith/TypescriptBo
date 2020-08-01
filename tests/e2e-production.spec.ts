import request from 'supertest';
import validJson from './_validProductionJson';
import {createApplication} from '../src/app';

let app;
const validResponse = JSON.parse(validJson);

beforeEach(() => {
    app = createApplication();
});

describe('POST /production', () => {

    test('valid: 200', () => {
        return request(app)
            .post('/productions')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(validJson)
            .then(res => {
                expect(res.status).toStrictEqual(200);
                expect(res.body).toStrictEqual(validResponse);
            });
    });

    test('invalid: 400, validation error', () => {
        return request(app)
            .post('/productions')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send('{"Id": ""}')
            .then(res => {
                expect(res.status).toStrictEqual(400);
                expect(res.body).toEqual(expect.objectContaining({
                    error: expect.arrayContaining([
                        expect.objectContaining({
                            'message': expect.stringContaining('Validation error')
                        })
                    ])
                }));
            });
    });

    test('Invalid: 400, malformed json', () => {
        return request(app)
            .post('/productions')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send('//')
            .then(res => {
                expect(res.status).toStrictEqual(400);
                expect(res.body).toEqual(expect.objectContaining({
                    error: expect.arrayContaining([
                        expect.objectContaining({
                            'message': expect.stringContaining('Invalid argument')
                        })
                    ])
                }));
            });
    });
});
