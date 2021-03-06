'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controller/google-meaning.controller');

router.get('/ingles', controller.buscarPalavraEn);
router.get('/portugues', controller.buscarPalavraPt);
// router.post('/', authService.isAdmin, controller.post);
// router.put('/:id',authService.isAdmin, controller.put);
// router.delete('/', authService.isAdmin, controller.delete);

// router.get('/:slug', controller.getBySlug);
// router.get('/admin/:id', controller.getById);
// router.get('/tags/:tag', controller.getByTag);

module.exports = router;
