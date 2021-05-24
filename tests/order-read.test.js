const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read order', () => {
    let db;
    let orders;

    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO FoodOrder (name, genre) VALUES(?, ?)', [
                'Burger',
                'Medium',
            ]),
            db.query('INSERT INTO FoodOrder (name, genre) VALUES(?, ?)', [
                'Wings',
                'Lemon and Herb',
            ]),
            db.query('INSERT INTO FoodOrder (name, genre) VALUES(?, ?)', [
                '1/2 Chicken',
                'Extra Hot',
            ]),
        ]);

        [orders] = await db.query('SELECT * From FoodOrder');
    });

    afterEach(async () => {
        await db.query('DELETE FROM FoodOrder');
        await db.close();
    });

    describe('/order', () => {
        describe('GET', () => {
            it('returns all order records in the database', async () => {
                const res = await request(app).get('/order').send();

                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(3);

                res.body.forEach((orderRecord) => {
                    const expected = orders.find((a) => a.id === orderRecord.id);

                    expect(orderRecord).to.deep.equal(expected);
                });
            });
        });
        describe('/order/:orderId', () => {
            describe('GET', () => {
                it('returns a single order with the correct id', async () => {
                    const expected = orders[0];
                    const res = await request(app).get(`/order/${expected.id}`).send();

                    expect(res.status).to.equal(200);
                    expect(res.body).to.deep.equal(expected);
                });

                it('returns a 404 if the order is not in the database', async () => {
                    const res = await request(app).get('/order/999999').send();

                    expect(res.status).to.equal(404);
                });
            });
        });
    });
});