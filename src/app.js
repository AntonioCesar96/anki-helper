'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(express.static('imagens'))


require('events').EventEmitter.prototype._maxListeners = 0;
require('events').defaultMaxListeners = 0;
process.on('warning', e => console.warn(e.stack));

// BodyParser
app.use(
  bodyParser.json({
    limit: '5mb'
  })
);

app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});

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
const cambridgeRoute = require('./routes/cambridge.route');
const collinsRoute = require('./routes/collins.route');
const googleMeaningRoute = require('./routes/google-meaning.route');
const dicioRoute = require('./routes/dicio.route');
const indexRoute = require('./routes/index.route');
const ankiRoute = require('./routes/anki.route');
const googleRoute = require('./routes/google.route');

app.use('/', indexRoute);
app.use('/cambridge', cambridgeRoute);
app.use('/collins', collinsRoute);
app.use('/google-meaning', googleMeaningRoute);
app.use('/dicio', dicioRoute);
app.use('/anki', ankiRoute);
app.use('/google', googleRoute);

module.exports = app;
