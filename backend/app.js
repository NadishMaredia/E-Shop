const express = require('express');
const errorMiddleware = require('./middleware/error')
const app = express();

app.use(express.json());
//Routes
const product = require('./routes/productRoute');

app.use('/api/v1', product);

//Middleware
app.use(errorMiddleware);

module.exports = app;