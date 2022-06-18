'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/kindle.controller');

router.get('/', controller.buscar);
router.get('/leitor', controller.leitor);
router.post('/leitor', controller.salvarHtml);

module.exports = router;
