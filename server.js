const express = require('express');


const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes');
//const cloudina
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = 8085;

app.use(cors());

// app middleware
app.use(bodyParser.json());

app.use('/upload', routes);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const URL = "mongodb+srv://wllmswalmart:123WwM456@bihelix.rrnc1u2.mongodb.net/wsec?retryWrites=true&w=majority";

mongoose.connect(URL, {});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Mongodb Connection success!');
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
  });
});
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
  });
});

app.use('/api/users', require('./routes/user'));
app.use('/api/stores', require('./routes/store'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/purchases', require('./routes/purchase'));
app.use('/api/quotations', require('./routes/quotation'));
app.use('/api/seed', require('./routes/seed'));

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});
app.use((req, res, next) => {
  const err = new Error('Internal Server Error');
  err.status = 500;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
