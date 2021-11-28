'use strict';

const repository = require('../repositories/anki.repository');

exports.obterNomeDosDecks = async (req, res, next) => {
  try {
    var retorno = await repository.obterNomeDosDecks();

    res.status(200).send(retorno.result);
  } catch (err) {
    handleError(res);
  }
}
exports.salvarNota = async (req, res, next) => {

  try {
    var retorno = await repository.salvarNota(req.body);

    res.status(200).send(retorno);
  } catch (err) {
    handleError(res);
  }
};

function handleError(res) {
  res.status(500).send({
    message: 'Falha ao processar sua requisição'
  });
}
