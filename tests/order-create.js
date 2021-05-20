const { expect } = require('chai');

const request = require('supertest');

const app = require('../src/app');


describe('create order', () => {
    describe('order', () => {
        describe('POST', () => {
            it('creates a new order in the database', async () => {
                const res = await request(app).post('/order').send({
                    product: 'Burger',
                    spice: 'Medium',
                });

                expect(res.status).to.equal(201);
            });
        });
    });
});