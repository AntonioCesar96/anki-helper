'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');

const app = express();
const router = express.Router();

// BodyParser
app.use(
  bodyParser.json({
    limit: '50mb'
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


app.use(express.static('imagens'))
app.use(express.static('html'))
app.use(express.static('cifra'))


require('events').EventEmitter.prototype._maxListeners = 0;
require('events').defaultMaxListeners = 0;
process.on('warning', e => console.warn(e.stack));



//Rotas aplicação
const cambridgeRoute = require('./routes/cambridge.route');
const collinsRoute = require('./routes/collins.route');
const googleMeaningRoute = require('./routes/google-meaning.route');
const dicioRoute = require('./routes/dicio.route');
const indexRoute = require('./routes/index.route');
const ankiRoute = require('./routes/anki.route');
const googleRoute = require('./routes/google.route');
const kindleRoute = require('./routes/kindle.route');
const cifraRoute = require('./routes/cifra.route');

app.use('/', indexRoute);
app.use('/cambridge', cambridgeRoute);
app.use('/collins', collinsRoute);
app.use('/google-meaning', googleMeaningRoute);
app.use('/dicio', dicioRoute);
app.use('/anki', ankiRoute);
app.use('/google', googleRoute);
app.use('/kindle', kindleRoute);
app.use('/cifra', cifraRoute);

module.exports = app;
