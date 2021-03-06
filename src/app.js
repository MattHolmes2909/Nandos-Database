const express = require('express');

const orderRouter = require('./routes/order');

const app = express();

app.use(express.json());

app.use('/order', orderRouter)

module.exports = app;