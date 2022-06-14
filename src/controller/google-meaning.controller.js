'use strict';

const repository = require('../repositories/google-meaning.repository');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // segundos

exports.buscarPalavraEn = async (req, res, next) => {

  try {
    var palavra = req.query.palavra;

    // if (cache.has(palavra)) {
    //   return res.status(200).json(cache.get(palavra));
    // }

    var retorno = { origem: '- Google', ordem: 3 };

    var element = await repository.buscarDefinicaoGoogle(palavra, '+meaning');
    retorno.dicionario = element;

    cache.set(palavra, retorno);

    res.status(200).send(retorno);
  } catch (err) {
    handleError(res, err);
  }
};

exports.buscarPalavraPt = async (req, res, next) => {

  try {
    var palavra = req.query.palavra;

    // if (cache.has(palavra)) {
    //   return res.status(200).json(cache.get(palavra));
    // }

    var retorno = { origem: '- Google', ordem: 3 };

    var element = await repository.buscarDefinicaoGoogle(palavra, '+significado');
    retorno.dicionario = element;

    cache.set(palavra, retorno);

    res.status(200).send(retorno);
  } catch (err) {
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
