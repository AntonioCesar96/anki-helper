'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/anki.controller');

router.post('/', controller.salvarNota);
router.get('/', controller.obterNomeDosDecks);

module.exports = router;
