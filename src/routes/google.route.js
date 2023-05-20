'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/google.controller');

router.post('/', controller.buscarPalavra);
router.get('/context', controller.obterContext);
router.get('/imagem', controller.obterImagem);
router.get('/pronunciation', controller.obterPronunciationAudio);

module.exports = router;
