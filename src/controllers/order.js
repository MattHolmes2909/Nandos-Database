const getDb = require('../services/db')


exports.create = async (req, res) => {
    const db = await getDb();
    const { food, spice } = req.body;

    try {
        await db.query('INSERT INTO FoodOrder (food, spice) VALUES (?, ?)', [
            food,
            spice,
        ]);
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500).json(err);
    }

    db.close();
};

exports.read = async (_, res) => {
    const db = await getDb();

    try {
        const [orders] = await db.query('SELECT * FROM FoodOrder');

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err)
    }
    db.close();
};

exports.readById = async (req, res) => {
    const db = await getDb();
    const { orderId } = req.params;

    const [[order]] = await db.query('SELECT * FROM FoodOrder WHERE id = ?', [
        orderId,
    ]);

    if (!order) {
        res.sendStatus(404);
    } else {
        res.status(200).json(order);
    }

    db.close();
};

exports.update = async (req, res) => {
    const db = await getDb();
    const data = req.body;
    const { orderId } = req.params;

    try {
        const [{ affectedRows }] = await db.query('UPDATE FoodOrder SET ? WHERE id = ?', [data, orderId]);

        if (!affectedRows) {
            res.sendStatus(404);
        } else {
            res.status(200).send();
        }
    } catch (err) {
        res.sendStatus(500);
    };

    db.close();
};

exports.delete = async (req, res) => {
    const db = await getDb();
    const { orderId } = req.params;

    try {
        const [{ affectedRows }] = await db.query('DELETE FROM FoodOrder WHERE id = ?', [orderId]);

        if (!affectedRows) {
            res.sendStatus(404);
        } else {
            res.status(200).json(affectedRows);
        }
    } catch (err) {
        res.sendStatus(500);
    }

    db.close();
}