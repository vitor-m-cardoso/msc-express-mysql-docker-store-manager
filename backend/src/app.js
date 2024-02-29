const express = require('express');

const app = express();

const { productsRouter, salesRouter } = require('./routes');

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'UP and Running! :D' });
});

app.use('/products', productsRouter);
app.use('/sales', salesRouter);

module.exports = app;
