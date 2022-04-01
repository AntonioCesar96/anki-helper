'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
const router = express.Router();

// BodyParser
app.use(
  bodyParser.json({
    limit: '5mb'
  })
);

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//Rotas aplicação
const mainRoute = require('./routes/dicionario.route');
const indexRoute = require('./routes/index.route');
const ankiRoute = require('./routes/anki.route');
const googleRoute = require('./routes/google.route');

app.use('/', indexRoute);
app.use('/dicionario', mainRoute);
app.use('/anki', ankiRoute);
app.use('/google', googleRoute);

module.exports = app;
