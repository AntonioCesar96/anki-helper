'use strict';

const repository = require('../repositories/anki.repository');

exports.obterNomeDosDecks = async (req, res, next) => {
  try {
    var retorno = await repository.obterNomeDosDecks();

    res.status(200).send(retorno.result);
  } catch (err) {
    handleError(res, err);
  }
}
exports.salvarNota = async (req, res, next) => {

  try {
    var retorno = await repository.salvarNota(req.body);

    res.status(200).send(retorno);
  } catch (err) {
    handleError(res, err);
  }
};

function handleError(res, err) {
  res.status(200).send({
    message: 'Falha ao processar sua requisição',
    error: err.message,
    stack: err.stack
  });
}
