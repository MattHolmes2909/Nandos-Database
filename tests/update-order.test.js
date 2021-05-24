const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('update order', () => {
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

        [orders] = await db.query('SELECT * FROM FoodOrder');
    });

    afterEach(async () => {
        await db.query('DELETE FROM FoodOrder');
        await db.close();
    });

    describe('/order/:orderId', () => {
        describe('PATCH', () => {
            it('updates a single order with the correct id', async () => {
                const order = orders[0];
                const res = await request(app)
                    .patch(`/order/${order.id}`)
                    .send({ food: 'new food', spice: 'new spice' });

                expect(res.status).to.equal(200);

                const [
                    [newOrderRecord],
                ] = await db.query('SELECT * FROM FoodOrder WHERE id = ?', [order.id]);

                expect(newOrderRecord.food).to.equal('new food');
            });

            it('returns a 404 if the artist is not in the database', async () => {
                const res = await request(app)
                    .patch('/order/999999')
                    .send({ food: 'new food' });

                expect(res.status).to.equal(404);
            });
        });
    });
});