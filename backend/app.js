const express = require('express');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const app = express();
var cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(cookieParser());
//Routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
//Middleware
app.use(errorMiddleware);

module.exports = app;