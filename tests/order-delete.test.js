const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('delete order', () => {
    let db;
    let orders;
    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO FoodOrder (food, spice) VALUES(?, ?)', [
                'Burger',
                'Medium',
            ]),
            db.query('INSERT INTO FoodOrder (food, spice) VALUES(?, ?)', [
                'Wings',
                'Lemon and Herb',
            ]),
            db.query('INSERT INTO FoodOrder (food, spice) VALUES(?, ?)', [
                '1/2 Chicken',
                'Extra Hot',
            ]),
        ]);

        [orders] = await db.query('SELECT * from FoodOrder');
    });

    afterEach(async () => {
        await db.query('DELETE FROM FoodOrder');
        await db.close();
    });

    describe('/order/:orderId', () => {
        describe('DELETE', () => {
            it('deletes a single order with the correct id', async () => {
                const order = orders[0];
                const res = await request(app).delete(`/order/${order.id}`).send();

                expect(res.status).to.equal(200);

                const [
                    [deletedOrderRecord],
                ] = await db.query('SELECT * FROM FoodOrder WHERE id = ?', [order.id]);

                expect(!!deletedOrderRecord).to.be.false;
            });

            it('returns a 404 if the order is not in the database', async () => {
                const res = await request(app).delete('/order/999999').send();

                expect(res.status).to.equal(404);
            });
        });
    });
});