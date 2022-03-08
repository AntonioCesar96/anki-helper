'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/anki.controller');

router.post('/', controller.salvarNota);
router.post('/notas', controller.salvarNotas);
router.get('/', controller.obterNomeDosDecks);

module.exports = router;
