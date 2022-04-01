'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/google.controller');

router.post('/', controller.buscarPalavra);

module.exports = router;
