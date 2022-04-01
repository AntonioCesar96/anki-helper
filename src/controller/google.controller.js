'use strict';

const repository = require('../repositories/google.repository');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // segundos

exports.buscarPalavra = async (req, res, next) => {

  try {

    var palavras = req.body;

    var lista = await repository.buscarPronuncias(palavras);
    console.log(lista);
    res.status(200).send(lista);
  } catch (err) {
    console.log(err);
    handleError(res, err);
  }
};

function handleError(res, err) {
  res.status(500).send({
    message: 'Falha ao processar sua requisição',
    error: err.message,
    stack: err.stack
  });
}
