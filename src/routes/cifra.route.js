'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/cifra.controller');

router.post('/salvar', controller.salvarJson);

module.exports = router;
