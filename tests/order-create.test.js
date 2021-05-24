const { expect } = require('chai');

const request = require('supertest');

const getDb= require('../src/services/db')

const app = require('../src/app');


describe('create order', () => {
    let db;
    beforeEach(async () => (db = await getDb()));

    afterEach(async () => {
        await db.query('DELETE FROM FoodOrder');
        await db.close();
    });

    describe('/order', () => {
        describe('POST', () => {
            it('creates a new order in the database', async () => {
                const res = await request(app).post('/order').send({
                    food: 'Burger',
                    spice: 'Medium',
                });

                expect(res.status).to.equal(201);

                const [[orderEntries]] = await db.query(
                    `SELECT * FROM FoodOrder WHERE food = 'Burger'`
                );

                expect(orderEntries.food).to.equal('Burger');
                expect(orderEntries.spice).to.equal('Medium');
            });
        });
    });
});